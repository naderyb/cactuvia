"use client";

import { useEffect, useState } from "react";
import styles from "./dashboard.module.css";

interface RecentOrder {
  id: string;
  order_number: number;
  full_name: string;
  total_price: number;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  created_at: string;
}

interface Stats {
  totalOrders: number;
  pending: number;
  shipped: number;
  revenue: number;
  totalProducts: number;
  recent: RecentOrder[];
}

const STATUS_LABEL: Record<string, string> = {
  pending: "En attente",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) setStats(await res.json());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
    });

  const cards = [
    { label: "COMMANDES TOTALES", value: stats ? stats.totalOrders : "-" },
    { label: "EN ATTENTE", value: stats ? stats.pending : "-" },
    { label: "EXPÉDIÉES", value: stats ? stats.shipped : "-" },
    { label: "PRODUITS ACTIFS", value: stats ? stats.totalProducts : "-" },
  ];

  return (
    <div>
      <div className={styles.header}>
        <p className={styles.kicker}>VUE D&apos;ENSEMBLE</p>
        <h1 className={styles.title}>Tableau de bord</h1>
      </div>

      <div className={styles.statsGrid}>
        {cards.map((c, i) => (
          <div className={styles.statCard} key={i}>
            <span className={styles.statLabel}>{c.label}</span>
            <span className={styles.statValue}>{loading ? "…" : c.value}</span>
          </div>
        ))}
      </div>

      {/* CA mis en avant */}
      <div className={styles.revenueCard}>
        <span className={styles.revenueLabel}>CHIFFRE D&apos;AFFAIRES</span>
        <span className={styles.revenueValue}>
          {loading ? "…" : fmtPrice(stats?.revenue ?? 0)}
        </span>
        <span className={styles.revenueNote}>Hors commandes annulées</span>
      </div>

      {/* Dernières commandes */}
      <div className={styles.recentSection}>
        <div className={styles.recentHead}>
          <h2 className={styles.recentTitle}>Dernières commandes</h2>
          <a href="/admin/orders" className={styles.viewAll}>
            Voir tout →
          </a>
        </div>

        {loading ? (
          <div className={styles.placeholder}>Chargement...</div>
        ) : !stats || stats.recent.length === 0 ? (
          <div className={styles.placeholder}>
            Aucune commande pour le moment.
          </div>
        ) : (
          <div className={styles.recentList}>
            {stats.recent.map((o) => (
              <a href="/admin/orders" key={o.id} className={styles.recentRow}>
                <span className={styles.rNum}>#{o.order_number}</span>
                <span className={styles.rName}>{o.full_name}</span>
                <span className={styles.rDate}>{fmtDate(o.created_at)}</span>
                <span className={styles.rPrice}>
                  {fmtPrice(Number(o.total_price))}
                </span>
                <span
                  className={`${styles.rBadge} ${styles["badge_" + o.status]}`}
                >
                  {STATUS_LABEL[o.status]}
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
