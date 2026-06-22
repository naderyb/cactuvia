import { auth } from "@/auth";
import { sql } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { newUsername, newPassword } = await req.json();

  if (!newUsername || !newPassword || newPassword.length < 8) {
    return NextResponse.json(
      { error: "Username requis et mot de passe ≥ 8 caractères." },
      { status: 400 },
    );
  }

  const id = session.user.id;

  // Vérifie si le username est déjà pris par un AUTRE admin
  const existing = await sql`
    SELECT id FROM admins
    WHERE username = ${newUsername} AND id <> ${id}
    LIMIT 1
  `;
  if (existing.length > 0) {
    return NextResponse.json(
      { error: "Ce nom d'utilisateur est déjà pris. Choisissez-en un autre." },
      { status: 409 },
    );
  }

  const hash = await bcrypt.hash(newPassword, 10);

  try {
    await sql`
      UPDATE admins
      SET username = ${newUsername},
          password_hash = ${hash},
          must_change_credentials = false
      WHERE id = ${id}
    `;
  } catch (err: unknown) {
    // Filet de sécurité : si deux requêtes arrivent en même temps,
    // la contrainte UNIQUE peut sauter ici malgré la vérif ci-dessus.
    const code =
      typeof err === "object" && err !== null && "code" in err
        ? (err as { code?: string }).code
        : undefined;

    if (code === "23505") {
      // 23505 = violation de contrainte unique (PostgreSQL)
      return NextResponse.json(
        {
          error: "Ce nom d'utilisateur est déjà pris. Choisissez-en un autre.",
        },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "Une erreur est survenue. Réessayez." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
