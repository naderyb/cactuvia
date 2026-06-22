import { auth } from "@/auth";
import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;

  await sql`
    UPDATE orders
    SET status = 'shipped', shipped_at = now()
    WHERE id = ${id}
  `;

  return NextResponse.json({ ok: true });
}
