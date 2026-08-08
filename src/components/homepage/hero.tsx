const CORNER_LABELS = [
  { label: "B", className: "top-6 left-7 sm:top-8 sm:left-10" },
  { label: "S", className: "top-6 right-7 sm:top-8 sm:right-10" },
  { label: "M", className: "bottom-6 left-7 sm:bottom-8 sm:left-10" },
  { label: "26", className: "bottom-6 right-7 sm:bottom-8 sm:right-10" },
] as const;

export function Hero() {
  return (
    <section
      aria-label="Hero"
      className="relative flex min-h-[70vh] flex-col items-center justify-center px-7 py-24 text-center sm:min-h-[80vh]"
    >
      {CORNER_LABELS.map((corner) => (
        <span
          key={corner.label}
          aria-hidden="true"
          className={`absolute font-sans text-xs text-muted-foreground/50 ${corner.className}`}
        >
          {corner.label}
        </span>
      ))}
      <h1 className="max-w-4xl font-sans text-5xl leading-[1.04] font-semibold tracking-[-0.01em] text-primary uppercase sm:text-6xl md:text-7xl">
        Clarity is
        <br />
        the feature.
      </h1>
    </section>
  );
}
