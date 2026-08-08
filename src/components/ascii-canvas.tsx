"use client";

import { useEffect, useRef } from "react";

import { createGlyphAtlas, GLYPH_COUNT } from "@/lib/ascii-canvas/glyph-atlas";
import { createScrollTracker } from "@/lib/ascii-canvas/scroll-progress";
import {
  CELL_SIZE_PX,
  FRAGMENT_SHADER,
  intensityForMorph,
  VERTEX_SHADER,
} from "@/lib/ascii-canvas/shaders";

function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("ascii-canvas: shader compile error", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function linkProgram(
  gl: WebGL2RenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("ascii-canvas: program link error", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

/**
 * Full-bleed WebGL2 ASCII background, scroll-morphed between the keyframe
 * shapes registered by `data-ascii-keyframe` elements elsewhere on the page.
 * Renders nothing (leaving the flat `bg-background` fallback) if WebGL2 or
 * shader compilation isn't available — see CLAUDE.md "graceful WebGL fallback".
 */
export function AsciiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
    });
    if (!gl) return;

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    const program = linkProgram(gl, vertexShader, fragmentShader);
    if (!program) return;

    gl.useProgram(program);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const uniforms = {
      resolution: gl.getUniformLocation(program, "uResolution"),
      time: gl.getUniformLocation(program, "uTime"),
      morph: gl.getUniformLocation(program, "uMorph"),
      intensity: gl.getUniformLocation(program, "uIntensity"),
      cellSize: gl.getUniformLocation(program, "uCellSize"),
      glyphCount: gl.getUniformLocation(program, "uGlyphCount"),
      glyphAtlas: gl.getUniformLocation(program, "uGlyphAtlas"),
    };

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const tracker = createScrollTracker();
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let disposed = false;
    let raf = 0;
    let atlasReady = false;

    function resize() {
      if (!canvas || !gl) return;
      const width = Math.round(canvas.clientWidth * dpr);
      const height = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
      tracker.measure();
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    window.addEventListener("resize", tracker.measure);
    resize();

    const start = performance.now();

    function frame(now: number) {
      if (disposed || !gl || !canvas) return;
      raf = requestAnimationFrame(frame);
      if (!atlasReady) return;

      const reduced = reducedMotionQuery.matches;
      const t = reduced ? 0 : (now - start) / 1000;
      const morph = tracker.read();

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
      gl.uniform1f(uniforms.time, t);
      gl.uniform1f(uniforms.morph, morph);
      gl.uniform1f(uniforms.intensity, intensityForMorph(morph));
      gl.uniform1f(uniforms.cellSize, CELL_SIZE_PX * dpr);
      gl.uniform1f(uniforms.glyphCount, GLYPH_COUNT);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(uniforms.glyphAtlas, 0);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    document.fonts.ready.then(() => {
      if (disposed || !gl) return;
      const atlas = createGlyphAtlas();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlas);
      atlasReady = true;
    });

    raf = requestAnimationFrame(frame);

    function handleVisibility() {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        raf = requestAnimationFrame(frame);
      }
    }
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      window.removeEventListener("resize", tracker.measure);
      document.removeEventListener("visibilitychange", handleVisibility);
      gl.deleteTexture(texture);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
