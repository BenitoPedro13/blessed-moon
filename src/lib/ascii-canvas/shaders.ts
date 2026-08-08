/**
 * Fullscreen triangle — no vertex buffer needed, positions are derived from
 * gl_VertexID (standard WebGL2 trick, covers clip space with 3 vertices).
 */
export const VERTEX_SHADER = /* glsl */ `#version 300 es
void main() {
  vec2 pos = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(pos * 2.0 - 1.0, 0.0, 1.0);
}
`;

/**
 * One pass: sample a procedural luminance field per screen cell (blended
 * between two adjacent keyframe shapes via uMorph), then look up the glyph
 * in uGlyphAtlas whose density matches that luminance.
 */
export const FRAGMENT_SHADER = /* glsl */ `#version 300 es
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform float uMorph;
uniform float uIntensity;
uniform float uCellSize;
uniform float uGlyphCount;
uniform sampler2D uGlyphAtlas;

out vec4 fragColor;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float sdCircle(vec2 p, vec2 c, float r) {
  return length(p - c) - r;
}

float sdBox(vec2 p, vec2 b) {
  vec2 d = abs(p) - b;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

/* keyframe 0 — hero: drifting noise mesh */
float fieldMesh(vec2 p, float t) {
  float n = noise(p * 6.0 + vec2(t * 0.05, t * 0.03));
  n += 0.5 * noise(p * 12.0 - vec2(t * 0.02, 0.0));
  return smoothstep(0.25, 0.95, n / 1.5);
}

/* keyframe 1 — about: crescent moon */
float fieldCrescent(vec2 p, float t) {
  float d1 = sdCircle(p, vec2(0.0), 0.28);
  float d2 = sdCircle(p, vec2(0.1, 0.05), 0.24);
  float d = max(d1, -d2);
  float shape = 1.0 - smoothstep(0.0, 0.02, d);
  float n = noise(p * 10.0 + t * 0.02);
  return shape * mix(0.55, 1.0, n);
}

/* keyframe 2 — services: circuit-board grid */
float fieldCircuit(vec2 p, float t) {
  vec2 g = p * 10.0;
  vec2 gv = fract(g) - 0.5;
  float lineX = smoothstep(0.46, 0.5, abs(gv.x));
  float lineY = smoothstep(0.46, 0.5, abs(gv.y));
  float lines = max(lineX, lineY);
  float node = 1.0 - smoothstep(0.0, 0.1, length(gv));
  float isLit = step(0.7, hash21(floor(g) + floor(t * 0.3)));
  return clamp(lines * 0.45 + node * isLit, 0.0, 1.0);
}

/* keyframe 3 — selected work: screenshot silhouette */
float fieldSilhouette(vec2 p, float t) {
  float frameDist = sdBox(p, vec2(0.42, 0.3));
  float frame = 1.0 - smoothstep(0.0, 0.015, abs(frameDist));
  float inside = 1.0 - step(0.0, frameDist);
  float rows = step(0.5, fract(p.y * 9.0 + t * 0.01));
  return clamp(frame + rows * inside * 0.35, 0.0, 1.0);
}

/* keyframe 4 — pricing/footer: dissolving into plain dark */
float fieldDissolve(vec2 p, float t) {
  return noise(p * 8.0 - t * 0.01) * 0.15;
}

float fieldAt(float idx, vec2 p, float t) {
  if (idx < 0.5) return fieldMesh(p, t);
  if (idx < 1.5) return fieldCrescent(p, t);
  if (idx < 2.5) return fieldCircuit(p, t);
  if (idx < 3.5) return fieldSilhouette(p, t);
  return fieldDissolve(p, t);
}

float sampleField(float morph, vec2 p, float t) {
  float idx = floor(morph);
  float frac = fract(morph);
  float a = fieldAt(idx, p, t);
  float b = fieldAt(min(idx + 1.0, 4.0), p, t);
  return mix(a, b, frac);
}

void main() {
  vec2 cellId = floor(gl_FragCoord.xy / uCellSize);
  vec2 cellUv = fract(gl_FragCoord.xy / uCellSize);
  vec2 cellCenter = (cellId + 0.5) * uCellSize;

  float aspect = uResolution.x / uResolution.y;
  vec2 p = (cellCenter / uResolution) - 0.5;
  p.x *= aspect;

  float lum = clamp(sampleField(uMorph, p, uTime), 0.0, 1.0);

  float glyphIndex = floor(lum * (uGlyphCount - 1.0) + 0.5);
  vec2 atlasUv = vec2((glyphIndex + cellUv.x) / uGlyphCount, cellUv.y);
  float glyphAlpha = texture(uGlyphAtlas, atlasUv).a;

  vec3 dimColor = vec3(0.62, 0.6, 0.58);
  vec3 amberColor = vec3(1.0, 0.4157, 0.1216);
  vec3 base = mix(dimColor, amberColor, smoothstep(0.55, 1.0, lum));

  float alpha = glyphAlpha * lum * uIntensity;
  fragColor = vec4(base * alpha, alpha);
}
`;

export const CELL_SIZE_PX = 9;

/** Subtle everywhere except the full-bleed hero; fades toward 0 through the dissolve keyframe. */
const KEYFRAME_INTENSITY = [0.55, 0.32, 0.3, 0.32, 0.16, 0.0];

export function intensityForMorph(morph: number): number {
  const idx = Math.floor(morph);
  const frac = morph - idx;
  const a = KEYFRAME_INTENSITY[Math.min(idx, KEYFRAME_INTENSITY.length - 1)];
  const b = KEYFRAME_INTENSITY[Math.min(idx + 1, KEYFRAME_INTENSITY.length - 1)];
  return a + (b - a) * frac;
}
