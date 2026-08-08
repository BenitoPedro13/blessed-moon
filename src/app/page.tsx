export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-7 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        Blessed Moon Studio — scaffold
      </p>
      <h1 className="font-sans text-5xl text-primary sm:text-6xl">
        Clarity is the feature.
      </h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Next.js + Tailwind + shadcn/ui scaffold is wired up. Homepage build
        (per README.md wireframe) is next.
      </p>
    </main>
  );
}
