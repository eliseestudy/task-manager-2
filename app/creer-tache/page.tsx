"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: number;
  name: string;
  email: string;
};

export default function CreerTache() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "PENDING",
    priority: "LOW",
    due_date: "",
    user_id: "",
    created_by_id: "1",
  });

  // Charger les utilisateurs au démarrage
  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch(() => setUsers([]));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          user_id: parseInt(form.user_id),
          created_by_id: parseInt(form.created_by_id),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur inconnue");
      }

      setSuccess(true);
      setTimeout(() => router.push("/liste-taches"), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Arrière-plan décoratif */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.18),transparent)]" />
      <div className="pointer-events-none absolute right-0 top-1/4 -z-10 h-72 w-72 translate-x-1/3 rounded-full bg-violet-400/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 -z-10 h-64 w-64 -translate-x-1/4 translate-y-1/4 rounded-full bg-emerald-400/10 blur-3xl" />

      <main className="mx-auto w-full max-w-2xl px-6 py-14 sm:py-20">

        {/* En-tête */}
        <div className="mb-10">
          <p className="mb-3 inline-flex rounded-full border border-zinc-200/80 bg-white/60 px-3 py-1 text-xs font-medium text-zinc-600 backdrop-blur-sm dark:border-zinc-700/80 dark:bg-zinc-900/60 dark:text-zinc-400">
            Nouvelle tâche
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Créer une tâche
          </h1>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">
            Remplissez les informations ci-dessous pour enregistrer une nouvelle tâche.
          </p>
        </div>

        {/* Message de succès */}
        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
            <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium">Tâche créée avec succès ! Redirection en cours…</p>
          </div>
        )}

        {/* Message d'erreur */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-800 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300">
            <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Formulaire */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white/70 p-8 shadow-sm backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-900/50">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Titre */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Titre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="Ex : Préparer la réunion de lundi"
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Décrivez la tâche en détail (optionnel)…"
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500 resize-none"
              />
            </div>

            {/* Statut + Priorité */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Statut
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                >
                  <option value="PENDING">⏳ En attente</option>
                  <option value="IN_PROGRESS">🔄 En cours</option>
                  <option value="COMPLETED">✅ Terminée</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Priorité
                </label>
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                >
                  <option value="LOW">🟢 Faible</option>
                  <option value="MEDIUM">🟡 Moyenne</option>
                  <option value="HIGH">🔴 Haute</option>
                </select>
              </div>
            </div>

            {/* Date d'échéance */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Date d&apos;échéance
              </label>
              <input
                type="date"
                name="due_date"
                value={form.due_date}
                onChange={handleChange}
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              />
            </div>

            {/* Assigner à */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Assigner à <span className="text-red-500">*</span>
              </label>
              {users.length === 0 ? (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
                  ⚠️ Aucun utilisateur trouvé.{" "}
                  <a href="/api/users" className="underline">
                    Créez d&apos;abord un utilisateur
                  </a>
                </div>
              ) : (
                <select
                  name="user_id"
                  value={form.user_id}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                >
                  <option value="">Sélectionner un utilisateur…</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Boutons */}
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button
                type="submit"
                disabled={loading || success}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-lg bg-zinc-900 px-6 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
              >
                {loading ? (
                  <>
                    <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Enregistrement…
                  </>
                ) : (
                  "Créer la tâche"
                )}
              </button>
              <button
                type="button"
                onClick={() => router.push("/liste-taches")}
                className="inline-flex h-11 items-center justify-center rounded-lg border border-zinc-300 bg-white/80 px-6 text-sm font-medium text-zinc-900 backdrop-blur-sm transition-colors hover:bg-white dark:border-zinc-600 dark:bg-zinc-900/80 dark:text-zinc-100 dark:hover:bg-zinc-800"
              >
                Annuler
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}