
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { Status, Priority } from "@prisma/client";


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const title       = searchParams.get("title") || undefined;
  const status      = searchParams.get("status") as Status | null;
  const priority    = searchParams.get("priority") as Priority | null;
  const due_before  = searchParams.get("due_before") || undefined;
  const due_after   = searchParams.get("due_after") || undefined;
  const assigned_to = searchParams.get("assigned_to") || undefined;

  try {
    const tasks = await prisma.tasks.findMany({
      where: {
        ...(title && {
          title: { contains: title },
        }),
        ...(status && { status }),
        ...(priority && { priority }),
        ...(due_before && { due_date: { lte: new Date(due_before) } }),
        ...(due_after  && { due_date: { gte: new Date(due_after) } }),
        ...(assigned_to && { user_id: parseInt(assigned_to) }),
      },
      include: {
        assign_to: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la recherche des tâches." },
      { status: 500 }
    );
  }
}