import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Status, Priority } from "@prisma/client";

// ── Helpers visuels ────────────────────────────────────────────────────────

const STATUS_META: Record<Status, { label: string; className: string }> = {
  PENDING: {
    label: "En attente",
    className:
      "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  },
  IN_PROGRESS: {
    label: "En cours",
    className:
      "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  },
  COMPLETED: {
    label: "Terminée",
    className:
      "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  },
};

const PRIORITY_META: Record<Priority, { label: string; className: string }> = {
  LOW: {
    label: "Faible",
    className:
      "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  },
  MEDIUM: {
    label: "Moyenne",
    className:
      "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  },
  HIGH: {
    label: "Élevée",
    className:
      "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  },
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function isOverdue(dueDate: Date | null, status: Status) {
  if (!dueDate || status === "COMPLETED") return false;
  return new Date(dueDate) < new Date();
}

// ── Composant carte tâche ──────────────────────────────────────────────────

type TaskWithUser = Awaited<
  ReturnType<typeof prisma.tasks.findMany>
>[number] & {
  assign_to: { name: string; email: string };
};

function TaskCard({ task }: { task: TaskWithUser }) {
  const status = STATUS_META[task.status];
  const priority = PRIORITY_META[task.priority];
  const overdue = isOverdue(task.due_date, task.status);

  return (
    <Link href={`/liste-taches/${task.id}`} className="group block">
    <article className="flex flex-col rounded-2xl border border-zinc-200/80 bg-white/70 p-6 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900/50">
      {/* Titre + priorité */}
      <div className="flex items-start justify-between gap-3">
        <h2 className="flex-1 font-semibold leading-snug text-zinc-900 dark:text-zinc-50">
          {task.title}
        </h2>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${priority.className}`}
        >
          {priority.label}
        </span>
      </div>

      {/* Description */}
      {task.description && (
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {task.description}
        </p>
      )}

      {/* Pied de carte */}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
        {/* Statut */}
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}
        >
          {status.label}
        </span>

        <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-500">
          {/* Assigné à */}
          <span className="inline-flex items-center gap-1">
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
            {task.assign_to.name}
          </span>

          {/* Date d'échéance */}
          {task.due_date && (
            <span
              className={`inline-flex items-center gap-1 ${overdue ? "text-rose-600 dark:text-rose-400" : ""}`}
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                />
              </svg>
              {overdue ? "En retard · " : ""}
              {formatDate(task.due_date)}
            </span>
          )}

          {/* Date de complétion */}
          {task.status === "COMPLETED" && task.completed_at && (
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {formatDate(task.completed_at)}
            </span>
          )}
        </div>
      </div>
    </article>
    </Link>
  );
}

// ── État vide ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="mt-16 flex flex-col items-center gap-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-200/80 bg-white/70 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/50">
        <svg
          className="h-7 w-7 text-zinc-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      </div>
      <div>
        <p className="font-semibold text-zinc-900 dark:text-zinc-50">
          Aucune tâche pour l&apos;instant
        </p>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Commencez par créer votre première tâche.
        </p>
      </div>
      <Link
        href="/creer-tache"
        className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-900 px-5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
      >
        Créer une tâche
      </Link>
    </div>
  );
}

// ── Page principale ────────────────────────────────────────────────────────

export default async function ListeTachesPage() {
  const tasks = await prisma.tasks.findMany({
    include: { assign_to: true },
    orderBy: [{ status: "asc" }, { priority: "desc" }, { created_at: "desc" }],
  });

  const counts = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "PENDING").length,
    inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
    completed: tasks.filter((t) => t.status === "COMPLETED").length,
  };

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      {/* Fond décoratif cohérent avec la page d'accueil */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.18),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.12),transparent)]"
        aria-hidden
      />

      <main className="mx-auto w-full max-w-5xl px-6 py-12">
        {/* En-tête */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Liste des tâches
            </h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {counts.total === 0
                ? "Aucune tâche"
                : `${counts.total} tâche${counts.total > 1 ? "s" : ""} — ${counts.inProgress} en cours · ${counts.completed} terminée${counts.completed > 1 ? "s" : ""}`}
            </p>
          </div>
          <Link
            href="/creer-tache"
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-zinc-900 px-5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            <svg
              className="h-4 w-4"
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
            Créer une tâche
          </Link>
        </div>

        {/* Compteurs rapides */}
        {counts.total > 0 && (
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full border border-zinc-200/80 bg-white/60 px-3 py-1 text-xs font-medium text-zinc-600 backdrop-blur-sm dark:border-zinc-700/80 dark:bg-zinc-900/60 dark:text-zinc-400">
              {counts.pending} en attente
            </span>
            <span className="rounded-full bg-violet-500/15 px-3 py-1 text-xs font-medium text-violet-700 dark:text-violet-300">
              {counts.inProgress} en cours
            </span>
            <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
              {counts.completed} terminée{counts.completed > 1 ? "s" : ""}
            </span>
          </div>
        )}

        {/* Contenu */}
        {tasks.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task as TaskWithUser} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
