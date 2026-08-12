"use client";

import { useEffect } from "react";
import { motion, useSpring, useTransform, type MotionValue } from "motion/react";

import "./counter.css";

/**
 * Adapted from React Bits' Counter (github.com/DavidHDev/react-bits,
 * src/content/Components/Counter — pulled from source directly, same
 * reason as every other react-bits/* component here: the registry JSON
 * endpoint and shadcn CLI can't reach reactbits.dev from this
 * environment). Digit-roll math is unchanged from upstream — each digit
 * is a vertical strip of 0–9 that a Motion spring drives to the target
 * row, an odometer rather than a plain number swap. Picked over
 * React Bits' ScrollFloat/ScrollReveal for the broader "elements move in
 * place" request specifically because this one is Motion-based
 * (`useSpring`/`useTransform`, already this project's dependency) —
 * those two are GSAP+ScrollTrigger, a second animation library running
 * alongside Motion for overlapping capability. Only change from upstream:
 * TypeScript types, no logic changes.
 */

function DigitStrip({
  motionValue,
  number,
  height,
}: {
  motionValue: MotionValue<number>;
  number: number;
  height: number;
}) {
  const y = useTransform(motionValue, (latest) => {
    const placeValue = latest % 10;
    const offset = (10 + number - placeValue) % 10;
    let memo = offset * height;
    if (offset > 5) memo -= 10 * height;
    return memo;
  });
  return (
    <motion.span className="counter-number" style={{ y }}>
      {number}
    </motion.span>
  );
}

function normalizeNearInteger(num: number): number {
  const nearest = Math.round(num);
  const tolerance = 1e-9 * Math.max(1, Math.abs(num));
  return Math.abs(num - nearest) < tolerance ? nearest : num;
}

function getValueRoundedToPlace(value: number, place: number): number {
  const scaled = value / place;
  return Math.floor(normalizeNearInteger(scaled));
}

function Digit({
  place,
  value,
  height,
  digitStyle,
}: {
  place: number | ".";
  value: number;
  height: number;
  digitStyle?: React.CSSProperties;
}) {
  const isDecimal = place === ".";
  const valueRoundedToPlace = isDecimal ? 0 : getValueRoundedToPlace(value, place as number);
  const animatedValue = useSpring(valueRoundedToPlace);

  useEffect(() => {
    if (!isDecimal) animatedValue.set(valueRoundedToPlace);
  }, [animatedValue, valueRoundedToPlace, isDecimal]);

  if (isDecimal) {
    return (
      <span className="counter-digit" style={{ height, ...digitStyle, width: "fit-content" }}>
        .
      </span>
    );
  }

  return (
    <span className="counter-digit" style={{ height, ...digitStyle }}>
      {Array.from({ length: 10 }, (_, i) => (
        <DigitStrip key={i} motionValue={animatedValue} number={i} height={height} />
      ))}
    </span>
  );
}

function defaultPlaces(value: number): (number | ".")[] {
  const chars = [...value.toString()];
  const dotIndex = chars.indexOf(".");
  return chars.map((ch, i) => {
    if (ch === ".") return ".";
    const exponent = dotIndex === -1 ? chars.length - i - 1 : i < dotIndex ? dotIndex - i - 1 : -(i - dotIndex);
    return 10 ** exponent;
  });
}

export interface CounterProps {
  value: number;
  fontSize?: number;
  padding?: number;
  places?: (number | ".")[];
  gap?: number;
  borderRadius?: number;
  horizontalPadding?: number;
  textColor?: string;
  fontWeight?: React.CSSProperties["fontWeight"];
  containerStyle?: React.CSSProperties;
  counterStyle?: React.CSSProperties;
  digitStyle?: React.CSSProperties;
  gradientHeight?: number;
  gradientFrom?: string;
  gradientTo?: string;
  topGradientStyle?: React.CSSProperties;
  bottomGradientStyle?: React.CSSProperties;
}

export function Counter({
  value,
  fontSize = 100,
  padding = 0,
  places,
  gap = 8,
  borderRadius = 4,
  horizontalPadding = 8,
  textColor = "inherit",
  fontWeight = "inherit",
  containerStyle,
  counterStyle,
  digitStyle,
  gradientHeight = 16,
  gradientFrom = "black",
  gradientTo = "transparent",
  topGradientStyle,
  bottomGradientStyle,
}: CounterProps) {
  const resolvedPlaces = places ?? defaultPlaces(value);
  const height = fontSize + padding;
  const defaultCounterStyle: React.CSSProperties = {
    fontSize,
    gap,
    borderRadius,
    paddingLeft: horizontalPadding,
    paddingRight: horizontalPadding,
    color: textColor,
    fontWeight,
    direction: "ltr",
  };
  const defaultTopGradientStyle: React.CSSProperties = {
    height: gradientHeight,
    background: `linear-gradient(to bottom, ${gradientFrom}, ${gradientTo})`,
  };
  const defaultBottomGradientStyle: React.CSSProperties = {
    height: gradientHeight,
    background: `linear-gradient(to top, ${gradientFrom}, ${gradientTo})`,
  };

  return (
    <span className="counter-container" style={containerStyle}>
      <span className="counter-counter" style={{ ...defaultCounterStyle, ...counterStyle }}>
        {resolvedPlaces.map((place, i) => (
          <Digit key={`${place}-${i}`} place={place} value={value} height={height} digitStyle={digitStyle} />
        ))}
      </span>
      <span className="gradient-container">
        <span className="top-gradient" style={topGradientStyle ?? defaultTopGradientStyle} />
        <span className="bottom-gradient" style={bottomGradientStyle ?? defaultBottomGradientStyle} />
      </span>
    </span>
  );
}

export default Counter;
