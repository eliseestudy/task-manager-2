import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// GET — Récupérer toutes les tâches
export async function GET() {
  try {
    const tasks = await prisma.tasks.findMany({
      include: { assign_to: true },
      orderBy: { created_at: "desc" },
    });
    return NextResponse.json(tasks);
  } catch (_error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des tâches" },
      { status: 500 }
    );
  }
}

// POST — Créer une nouvelle tâche
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, status, priority, due_date, user_id, created_by_id } = body;

    // Vérifications de base
    if (!title || !user_id || !created_by_id) {
      return NextResponse.json(
        { error: "Le titre et l'utilisateur sont obligatoires" },
        { status: 400 }
      );
    }

    const task = await prisma.tasks.create({
      data: {
        title,
        description: description || null,
        status: status || "PENDING",
        priority: priority || "LOW",
        due_date: due_date ? new Date(due_date) : null,
        user_id: parseInt(user_id),
        created_by_id: parseInt(created_by_id),
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la tâche" },
      { status: 500 }
    );
  }
}