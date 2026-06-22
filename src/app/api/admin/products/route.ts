import { auth } from "@/auth";
import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const products = await sql`
    SELECT * FROM products WHERE is_active = true ORDER BY created_at DESC
  `;
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const b = await req.json();
  const rows = await sql`
    INSERT INTO products
      (name, description, category, subtitle, price, volume, image_url, image_public_id, tag)
    VALUES
      (${b.name}, ${b.description ?? null}, ${b.category ?? null}, ${b.subtitle ?? null},
       ${b.price ?? 0}, ${b.volume ?? null}, ${b.imageUrl ?? null},
       ${b.imagePublicId ?? null}, ${b.tag ?? null})
    RETURNING *
  `;
  return NextResponse.json(rows[0]);
}
