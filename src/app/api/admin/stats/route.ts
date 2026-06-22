import { auth } from "@/auth";
import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  // Compteurs commandes + CA (CA = commandes non annulées)
  const totals = await sql`
    SELECT
      COUNT(*)::int AS total_orders,
      COUNT(*) FILTER (WHERE status = 'pending')::int AS pending,
      COUNT(*) FILTER (WHERE status = 'shipped')::int AS shipped,
      COALESCE(SUM(total_price) FILTER (WHERE status <> 'cancelled'), 0) AS revenue
    FROM orders
  `;

  // Nombre de produits actifs
  const productRows = await sql`
    SELECT COUNT(*)::int AS total_products
    FROM products WHERE is_active = true
  `;

  // 5 dernières commandes
  const recent = await sql`
    SELECT id, order_number, full_name, total_price, status, created_at
    FROM orders
    ORDER BY created_at DESC
    LIMIT 5
  `;

  return NextResponse.json({
    totalOrders: totals[0].total_orders,
    pending: totals[0].pending,
    shipped: totals[0].shipped,
    revenue: Number(totals[0].revenue),
    totalProducts: productRows[0].total_products,
    recent,
  });
}
