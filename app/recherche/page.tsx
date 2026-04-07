"use client";

import { useState, useCallback } from "react";

type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";
type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

interface User {
  id: number;
  name: string;
  email: string;
}

interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  created_at: string;
  updated_at: string;
  due_date: string | null;
  completed_at: string | null;
  user_id: number;
  assign_to: User;
  created_by_id: number;
}

const STATUS_LABELS: Record<TaskStatus, string> = {
  PENDING: "En attente",
  IN_PROGRESS: "En cours",
  COMPLETED: "Terminée",
};

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  LOW: "Basse",
  MEDIUM: "Moyenne",
  HIGH: "Haute",
};

const STATUS_COLORS: Record<TaskStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  IN_PROGRESS: "bg-blue-100 text-blue-800 border-blue-200",
  COMPLETED: "bg-green-100 text-green-800 border-green-200",
};

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  LOW: "bg-slate-100 text-slate-600 border-slate-200",
  MEDIUM: "bg-orange-100 text-orange-700 border-orange-200",
  HIGH: "bg-red-100 text-red-700 border-red-200",
};

export default function RecherchePage() {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<string>("");
  const [priority, setPriority] = useState<string>("");
  const [dueBefore, setDueBefore] = useState("");
  const [dueAfter, setDueAfter] = useState("");

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (title)      params.set("title", title);
    if (status)     params.set("status", status);
    if (priority)   params.set("priority", priority);
    if (dueBefore)  params.set("due_before", dueBefore);
    if (dueAfter)   params.set("due_after", dueAfter);

    try {
      const res = await fetch(`/api/tasks/search?${params.toString()}`);
      if (!res.ok) throw new Error("Erreur serveur");
      const data = await res.json();
      setTasks(data.tasks);
      setSearched(true);
    } catch {
      setError("Impossible de récupérer les tâches. Vérifie que le serveur tourne.");
    } finally {
      setLoading(false);
    }
  }, [title, status, priority, dueBefore, dueAfter]);

  const handleReset = () => {
    setTitle("");
    setStatus("");
    setPriority("");
    setDueBefore("");
    setDueAfter("");
    setTasks([]);
    setSearched(false);
    setError(null);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("fr-CA", {
      year: "numeric", month: "short", day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Recherche de tâches</h1>
          <p className="text-gray-500 mt-1">Filtre les tâches selon le titre, statut, priorité ou date d'échéance.</p>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Titre */}
           <input
  type="text"
  placeholder="Ex: Implémenter le login..."
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm 
  placeholder:text-blue-500 
  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
/>

            {/* Statut */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white 
    focus:outline-none focus:ring-2 focus:ring-blue-500 transition 
    text-blue-500"
              >
                <option value="">Tous les statuts</option>
                <option value="PENDING">En attente</option>
                <option value="IN_PROGRESS">En cours</option>
                <option value="COMPLETED">Terminée</option>
              </select>
            </div>

            {/* Priorité */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priorité</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white 
    focus:outline-none focus:ring-2 focus:ring-blue-500 transition 
    text-blue-500"
              >
                <option value="">Toutes les priorités</option>
                <option value="LOW">Basse</option>
                <option value="MEDIUM">Moyenne</option>
                <option value="HIGH">Haute</option>
              </select>
            </div>

            {/* Date après */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Échéance après le</label>
              <input
                type="date"
                value={dueAfter}
                onChange={(e) => setDueAfter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white 
    focus:outline-none focus:ring-2 focus:ring-blue-500 transition 
    text-blue-500"
              />
            </div>

            {/* Date avant */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Échéance avant le</label>
              <input
                type="date"
                value={dueBefore}
                onChange={(e) => setDueBefore(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white 
    focus:outline-none focus:ring-2 focus:ring-blue-500 transition 
    text-blue-500"
              />
            </div>
          </div>

          {/* Boutons */}
          <div className="flex gap-3 mt-5">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition"
            >
              {loading ? (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
                </svg>
              )}
              {loading ? "Recherche..." : "Rechercher"}
            </button>

            {searched && (
              <button
                onClick={handleReset}
                className="text-sm text-gray-500 hover:text-gray-800 px-4 py-2.5 rounded-lg border border-gray-200 hover:border-gray-300 transition"
              >
                Réinitialiser
              </button>
            )}
          </div>
        </div>

        {/* Erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Résultats */}
        {searched && (
          <div>
            <p className="text-sm text-gray-500 mb-4">
              {tasks.length === 0
                ? "Aucune tâche trouvée pour ces critères."
                : `${tasks.length} tâche${tasks.length > 1 ? "s" : ""} trouvée${tasks.length > 1 ? "s" : ""}`}
            </p>

            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 truncate">{task.title}</h3>
                      {task.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{task.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${STATUS_COLORS[task.status]}`}>
                        {STATUS_LABELS[task.status]}
                      </span>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${PRIORITY_COLORS[task.priority]}`}>
                        {PRIORITY_LABELS[task.priority]}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3 text-xs text-gray-400">
                    <span>Assigné à : <span className="text-gray-600 font-medium">{task.assign_to.name}</span></span>
                    <span>Échéance : <span className="text-gray-600">{formatDate(task.due_date)}</span></span>
                    <span>Créée le : <span className="text-gray-600">{formatDate(task.created_at)}</span></span>
                    {task.completed_at && (
                      <span>Terminée le : <span className="text-gray-600">{formatDate(task.completed_at)}</span></span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}