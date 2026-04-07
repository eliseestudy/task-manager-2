"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Accueil", match: (p: string) => p === "/" },
  {
    href: "/liste-taches",
    label: "Liste des tâches",
    match: (p: string) => p.startsWith("/liste-taches"),
  },
  {
    href: "/recherche",
    label: "Recherche",
    match: (p: string) => p.startsWith("/recherche"),
  },
  {
    href: "/creer-tache",
    label: "Créer tâche",
    match: (p: string) => p.startsWith("/creer-tache"),
  },
] as const;

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/90">
      <nav
        className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
        aria-label="Navigation principale"
      >
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-zinc-900 transition-opacity hover:opacity-80 dark:text-zinc-50"
        >
          Task Manager
        </Link>
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium">
          {links.map(({ href, label, match }) => {
            const active = match(pathname);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={
                    active
                      ? "text-zinc-950 dark:text-white"
                      : "text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                  }
                  aria-current={active ? "page" : undefined}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
