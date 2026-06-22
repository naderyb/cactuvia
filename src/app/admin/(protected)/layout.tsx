"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import Image from "next/image";
import styles from "./AdminLayout.module.css";

const navItems = [
  { label: "Tableau de bord", href: "/admin/dashboard", icon: "grid" },
  { label: "Commandes", href: "/admin/orders", icon: "bag" },
  { label: "Produits", href: "/admin/products", icon: "box" },
];

function Icon({ name }: { name: string }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
  };
  if (name === "grid")
    return (
      <svg {...common}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    );
  if (name === "bag")
    return (
      <svg {...common}>
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      <line x1="12" y1="22" x2="12" y2="12" />
    </svg>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.shell}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${open ? styles.sidebarOpen : ""}`}>
        <div className={styles.brand}>
          <Image
            src="/logo2.png"
            alt="Cactuvia"
            width={130}
            height={78}
            style={{ height: "auto", width: "120px" }}
            priority
          />
          <span className={styles.brandTag}>ESPACE ADMIN</span>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${active ? styles.navLinkActive : ""}`}
                onClick={() => setOpen(false)}
              >
                <Icon name={item.icon} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        <button
          className={styles.logout}
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          >
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Déconnexion</span>
        </button>
      </aside>

      {/* overlay mobile */}
      {open && (
        <div className={styles.overlay} onClick={() => setOpen(false)} />
      )}

      {/* Main */}
      <div className={styles.main}>
        <header className={styles.topbar}>
          <button
            className={styles.burger}
            onClick={() => setOpen(true)}
            aria-label="Menu"
          >
            <span />
            <span />
            <span />
          </button>
          <span className={styles.topbarBrand}>CACTUVIA</span>
        </header>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
