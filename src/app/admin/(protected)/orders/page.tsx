"use client";

import { useEffect, useState, useCallback } from "react";
import styles from "./orders.module.css";

interface OrderItem {
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

interface Order {
  id: string;
  order_number: number;
  full_name: string;
  phone: string;
  address: string;
  city: string | null;
  wilaya: string | null;
  email: string | null;
  note: string | null;
  total_price: number;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  shipped_at: string | null;
  created_at: string;
  items: OrderItem[];
}

const STATUS_LABEL: Record<string, string> = {
  pending: "En attente",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "shipped">("all");
  const [shipping, setShipping] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      if (res.ok) setOrders(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  async function markShipped(id: string) {
    setShipping(id);
    try {
      const res = await fetch(`/api/orders/${id}/ship`, { method: "PATCH" });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === id
              ? {
                  ...o,
                  status: "shipped",
                  shipped_at: new Date().toISOString(),
                }
              : o,
          ),
        );
      }
    } finally {
      setShipping(null);
    }
  }

  const filtered = orders.filter((o) =>
    filter === "all" ? true : o.status === filter,
  );

  const fmtPrice = (n: number) =>
    new Intl.NumberFormat("fr-DZ", {
      style: "currency",
      currency: "DZD",
      minimumFractionDigits: 0,
    }).format(n);

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div>
      <div className={styles.header}>
        <div>
          <p className={styles.kicker}>GESTION</p>
          <h1 className={styles.title}>Commandes</h1>
        </div>
        <div className={styles.filters}>
          {(["all", "pending", "shipped"] as const).map((f) => (
            <button
              key={f}
              className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "all"
                ? "Toutes"
                : f === "pending"
                  ? "En attente"
                  : "Expédiées"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className={styles.empty}>Chargement des commandes...</div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>
          Aucune commande {filter !== "all" ? "dans cette catégorie" : ""}.
        </div>
      ) : (
        <div className={styles.list}>
          {filtered.map((o) => {
            const isOpen = openId === o.id;
            return (
              <div key={o.id} className={styles.card}>
                <div
                  className={styles.cardHead}
                  onClick={() => setOpenId(isOpen ? null : o.id)}
                >
                  <div className={styles.cardMain}>
                    <span className={styles.orderNum}>#{o.order_number}</span>
                    <div className={styles.cardWho}>
                      <span className={styles.name}>{o.full_name}</span>
                      <span className={styles.date}>
                        {fmtDate(o.created_at)}
                      </span>
                    </div>
                  </div>

                  <div className={styles.cardRight}>
                    <span className={styles.total}>
                      {fmtPrice(Number(o.total_price))}
                    </span>
                    <span
                      className={`${styles.badge} ${styles["badge_" + o.status]}`}
                    >
                      {STATUS_LABEL[o.status]}
                    </span>
                    <svg
                      className={`${styles.chevron} ${isOpen ? styles.chevronUp : ""}`}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>

                {isOpen && (
                  <div className={styles.details}>
                    <div className={styles.detailGrid}>
                      <div className={styles.detailBlock}>
                        <span className={styles.detailLabel}>TÉLÉPHONE</span>
                        <span className={styles.detailValue}>{o.phone}</span>
                      </div>
                      <div className={styles.detailBlock}>
                        <span className={styles.detailLabel}>ADRESSE</span>
                        <span className={styles.detailValue}>
                          {o.address}
                          {o.city ? `, ${o.city}` : ""}
                          {o.wilaya ? `, ${o.wilaya}` : ""}
                        </span>
                      </div>
                      {o.email && (
                        <div className={styles.detailBlock}>
                          <span className={styles.detailLabel}>EMAIL</span>
                          <span className={styles.detailValue}>{o.email}</span>
                        </div>
                      )}
                      {o.note && (
                        <div className={styles.detailBlock}>
                          <span className={styles.detailLabel}>NOTE</span>
                          <span className={styles.detailValue}>{o.note}</span>
                        </div>
                      )}
                    </div>

                    <div className={styles.itemsTable}>
                      <div className={styles.itemsHead}>
                        <span>PRODUIT</span>
                        <span>QTÉ</span>
                        <span>PRIX U.</span>
                        <span>TOTAL</span>
                      </div>
                      {o.items.map((it, i) => (
                        <div className={styles.itemRow} key={i}>
                          <span>{it.productName}</span>
                          <span>{it.quantity}</span>
                          <span>{fmtPrice(Number(it.unitPrice))}</span>
                          <span>{fmtPrice(Number(it.lineTotal))}</span>
                        </div>
                      ))}
                      <div className={styles.itemsTotal}>
                        <span>TOTAL COMMANDE</span>
                        <span>{fmtPrice(Number(o.total_price))}</span>
                      </div>
                    </div>

                    {o.status === "pending" ? (
                      <button
                        className={styles.shipBtn}
                        onClick={() => markShipped(o.id)}
                        disabled={shipping === o.id}
                      >
                        {shipping === o.id
                          ? "TRAITEMENT..."
                          : "MARQUER COMME EXPÉDIÉE"}
                      </button>
                    ) : (
                      <div className={styles.shippedNote}>
                        ✓ Expédiée
                        {o.shipped_at ? ` le ${fmtDate(o.shipped_at)}` : ""}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
