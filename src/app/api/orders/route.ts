import { auth } from "@/auth";
import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

interface OrderItemInput {
  productId?: string;
  productName: string;
  unitPrice: number;
  quantity: number;
}

// CLIENT → envoie une commande (public)
export async function POST(req: Request) {
    const body = await req.json();
    const { fullName, phone, address, city, wilaya, email, note, items } = body as {
      fullName: string;
      phone: string;
      address: string;
      city?: string;
      wilaya?: string;
      email?: string;
      note?: string;
      items: OrderItemInput[];
    };
  
    if (!fullName || !phone || !address || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Champs manquants." }, { status: 400 });
    }
  
    const total = items.reduce(
      (sum: number, it: OrderItemInput) => sum + Number(it.unitPrice) * Number(it.quantity),
      0
    );

  const orderRows = await sql`
    INSERT INTO orders (full_name, phone, address, city, wilaya, email, note, total_price)
    VALUES (${fullName}, ${phone}, ${address}, ${city ?? null}, ${wilaya ?? null},
            ${email ?? null}, ${note ?? null}, ${total})
    RETURNING id, order_number
  `;
  const order = orderRows[0];

  for (const it of items) {
    const lineTotal = Number(it.unitPrice) * Number(it.quantity);
    await sql`
      INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity, line_total)
      VALUES (${order.id}, ${it.productId ?? null}, ${it.productName},
              ${it.unitPrice}, ${it.quantity}, ${lineTotal})
    `;
  }

  return NextResponse.json({ ok: true, orderNumber: order.order_number });
}

// ADMIN → liste des commandes (protégé)
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const orders = await sql`
    SELECT o.*,
      COALESCE(
        json_agg(
          json_build_object(
            'productName', oi.product_name,
            'unitPrice', oi.unit_price,
            'quantity', oi.quantity,
            'lineTotal', oi.line_total
          )
        ) FILTER (WHERE oi.id IS NOT NULL), '[]'
      ) AS items
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `;

  return NextResponse.json(orders);
}
