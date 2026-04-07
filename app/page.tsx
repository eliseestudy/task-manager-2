import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.18),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.12),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-0 top-1/4 -z-10 h-72 w-72 translate-x-1/3 rounded-full bg-violet-400/10 blur-3xl dark:bg-violet-500/10"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 -z-10 h-64 w-64 -translate-x-1/4 translate-y-1/4 rounded-full bg-emerald-400/10 blur-3xl dark:bg-emerald-500/10"
        aria-hidden
      />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-14 sm:py-20">
        <div className="max-w-2xl">
          <p className="mb-3 inline-flex rounded-full border border-zinc-200/80 bg-white/60 px-3 py-1 text-xs font-medium text-zinc-600 backdrop-blur-sm dark:border-zinc-700/80 dark:bg-zinc-900/60 dark:text-zinc-400">
            Exercice — Gestion de tâches
          </p>
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl sm:leading-tight">
            Pilotez vos tâches avec aisance !
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            Centralisez ce que vous avez à faire, ajoutez de nouvelles tâches et
            consultez la liste quand vous voulez — tout depuis ce mini
            gestionnaire.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/liste-taches"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-zinc-900 px-6 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
            >
              Voir la liste des tâches
            </Link>
            <Link
              href="/creer-tache"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-zinc-300 bg-white/80 px-6 text-sm font-medium text-zinc-900 backdrop-blur-sm transition-colors hover:bg-white dark:border-zinc-600 dark:bg-zinc-900/80 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              Créer une tâche
            </Link>
          </div>
        </div>

        <section
          className="mt-16 grid gap-4 sm:grid-cols-3 sm:gap-5"
          aria-labelledby="home-features-heading"
        >
          <h2 id="home-features-heading" className="sr-only">
            Fonctionnalités
          </h2>
          <article className="rounded-2xl border border-zinc-200/80 bg-white/70 p-6 shadow-sm backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-900/50">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/15 text-violet-700 dark:text-violet-300">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
              Liste claire
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Parcourez toutes vos tâches depuis une page dédiée.
            </p>
          </article>
          <article className="rounded-2xl border border-zinc-200/80 bg-white/70 p-6 shadow-sm backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-900/50">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
              Création rapide
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Ajoutez une nouvelle tâche en quelques clics.
            </p>
          </article>
          <article className="rounded-2xl border border-zinc-200/80 bg-white/70 p-6 shadow-sm backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-900/50">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/15 text-amber-800 dark:text-amber-200">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
              Objectif pédagogique
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Navigation, pages et logique métier à compléter au fil du cours.
            </p>
          </article>
        </section>
      </main>
    </div>
  );
}
