export function SectionHeading({
  number,
  label,
}: {
  number: string;
  label: string;
}) {
  return (
    <p className="mb-2 font-mono text-[10.5px] tracking-[0.5px] text-muted-foreground">
      {number} / {label}
    </p>
  );
}
