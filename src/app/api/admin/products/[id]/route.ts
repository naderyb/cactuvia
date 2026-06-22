import { auth } from "@/auth";
import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;
  const b = await req.json();

  await sql`
    UPDATE products SET
      name = ${b.name},
      description = ${b.description ?? null},
      category = ${b.category ?? null},
      subtitle = ${b.subtitle ?? null},
      price = ${b.price ?? 0},
      volume = ${b.volume ?? null},
      image_url = ${b.imageUrl ?? null},
      image_public_id = ${b.imagePublicId ?? null},
      tag = ${b.tag ?? null}
    WHERE id = ${id}
  `;
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;
  // soft-delete : on garde l'historique des commandes
  await sql`UPDATE products SET is_active = false WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
