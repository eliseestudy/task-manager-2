export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      {/* En-tête squelette */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="h-8 w-48 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
          <div className="mt-2 h-4 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <div className="h-11 w-40 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
      </div>

      {/* Grille squelette */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-zinc-200/80 bg-white/70 p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/50"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="h-5 w-3/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-5 w-16 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
            </div>
            <div className="mt-3 h-4 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="mt-1 h-4 w-2/3 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="mt-6 flex items-center justify-between">
              <div className="h-5 w-20 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-4 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
