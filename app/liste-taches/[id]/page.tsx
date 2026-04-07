import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Status, Priority } from "@prisma/client";

type TaskDetailPageProps = {
  params: Promise<{ id: string }>;
};

// ── Helpers visuels ────────────────────────────────────────────────────────

const STATUS_META: Record<Status, { label: string; className: string }> = {
  PENDING: {
    label: "En attente",
    className: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  },
  IN_PROGRESS: {
    label: "En cours",
    className: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  },
  COMPLETED: {
    label: "Terminée",
    className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  },
};

const PRIORITY_META: Record<Priority, { label: string; className: string }> = {
  LOW: {
    label: "Faible",
    className: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  },
  MEDIUM: {
    label: "Moyenne",
    className: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  },
  HIGH: {
    label: "Élevée",
    className: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  },
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function isOverdue(dueDate: Date | null, status: Status) {
  if (!dueDate || status === "COMPLETED") return false;
  return new Date(dueDate) < new Date();
}

// ── Page ──────────────────────────────────────────────────────────────────

export default async function TaskDetailPage({
  params,
}: TaskDetailPageProps) {
  const { id } = await params;
  const taskId = parseInt(id, 10);

  if (isNaN(taskId)) notFound();

  const task = await prisma.tasks.findUnique({
    where: { id: taskId },
    include: { assign_to: true },
  });

  if (!task) notFound();

  const status = STATUS_META[task.status];
  const priority = PRIORITY_META[task.priority];
  const overdue = isOverdue(task.due_date, task.status);

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.18),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.12),transparent)]"
        aria-hidden
      />

      <main className="mx-auto w-full max-w-2xl px-6 py-12">
        {/* Retour */}
        <Link
          href="/liste-taches"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
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
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          Retour à la liste
        </Link>

        {/* Carte détail */}
        <article className="mt-6 rounded-2xl border border-zinc-200/80 bg-white/70 p-8 shadow-sm backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-900/50">
          {/* En-tête : titre + badges */}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h1 className="flex-1 text-2xl font-semibold leading-snug text-zinc-900 dark:text-zinc-50">
              {task.title}
            </h1>
            <div className="flex flex-wrap gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${priority.className}`}
              >
                {priority.label}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${status.className}`}
              >
                {status.label}
              </span>
            </div>
          </div>

          {/* Description */}
          {task.description ? (
            <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {task.description}
            </p>
          ) : (
            <p className="mt-4 text-sm italic text-zinc-400 dark:text-zinc-600">
              Aucune description.
            </p>
          )}

          {/* Séparateur */}
          <hr className="my-6 border-zinc-200/80 dark:border-zinc-800/80" />

          {/* Métadonnées */}
          <dl className="grid gap-4 sm:grid-cols-2">
            {/* Assigné à */}
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                Assigné à
              </dt>
              <dd className="mt-1 flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-200 text-xs font-semibold text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
                  {task.assign_to.name.charAt(0).toUpperCase()}
                </span>
                <span>
                  {task.assign_to.name}
                  <span className="ml-1 text-zinc-400 dark:text-zinc-500">
                    ({task.assign_to.email})
                  </span>
                </span>
              </dd>
            </div>

            {/* Créée le */}
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                Créée le
              </dt>
              <dd className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                {formatDate(task.created_at)}
              </dd>
            </div>

            {/* Date d'échéance */}
            {task.due_date && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                  Échéance
                </dt>
                <dd
                  className={`mt-1 flex items-center gap-1 text-sm font-medium ${
                    overdue
                      ? "text-rose-600 dark:text-rose-400"
                      : "text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  {overdue && (
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
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                      />
                    </svg>
                  )}
                  {overdue ? "En retard · " : ""}
                  {formatDate(task.due_date)}
                </dd>
              </div>
            )}

            {/* Terminée le */}
            {task.status === "COMPLETED" && task.completed_at && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                  Terminée le
                </dt>
                <dd className="mt-1 flex items-center gap-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
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
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {formatDate(task.completed_at)}
                </dd>
              </div>
            )}

            {/* Mise à jour le */}
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                Dernière mise à jour
              </dt>
              <dd className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                {formatDate(task.updated_at)}
              </dd>
            </div>
          </dl>
        </article>
      </main>
    </div>
  );
}
