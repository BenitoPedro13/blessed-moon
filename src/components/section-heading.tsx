export function SectionHeading({
  number,
  label,
  /** Defaults to the standalone spacing. `TerminalPanel` passes its own, since
   * in a title bar the label is flush with the rule beside it. */
  className = "mb-2",
}: {
  number: string;
  label: string;
  className?: string;
}) {
  return (
    <p
      className={`font-mono text-[10.5px] tracking-[0.5px] text-muted-foreground ${className}`}
    >
      {number} / {label}
    </p>
  );
}
