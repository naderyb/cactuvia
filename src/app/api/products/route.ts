import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = searchParams.get("limit");
  const featured = searchParams.get("featured");

  let products;

  if (featured === "true") {
    // aperçu : priorité aux produits taggés, complété par les récents
    products = await sql`
      SELECT id, name, description, category, subtitle, price, volume, image_url, tag
      FROM products
      WHERE is_active = true
      ORDER BY (tag IS NOT NULL) DESC, created_at DESC
      LIMIT ${limit ? Number(limit) : 4}
    `;
  } else if (limit) {
    products = await sql`
      SELECT id, name, description, category, subtitle, price, volume, image_url, tag
      FROM products
      WHERE is_active = true
      ORDER BY created_at DESC
      LIMIT ${Number(limit)}
    `;
  } else {
    products = await sql`
      SELECT id, name, description, category, subtitle, price, volume, image_url, tag
      FROM products
      WHERE is_active = true
      ORDER BY created_at DESC
    `;
  }

  return NextResponse.json(products);
}
