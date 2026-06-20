"use client";

import { useState, useEffect } from "react";
import styles from "./Navbar.module.css";

const navLinks = [
  { label: "BOUTIQUE", href: "#boutique" },
  { label: "RITUELS", href: "#rituels" },
  { label: "INGRÉDIENTS", href: "#ingredients" },
  { label: "À PROPOS", href: "#apropos" },
  { label: "JOURNAL", href: "#journal" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}>
        <div className={styles.inner}>
          <a href="#hero" className={styles.logo}>
            <span className={styles.logoName}>CACTUVIA</span>
            <span className={styles.logoSub}>SOINS NATURELS</span>
          </a>

          <div className={styles.links}>
            {navLinks.map((l) => (
              <a key={l.label} href={l.href} className={styles.link}>{l.label}</a>
            ))}
          </div>

          <div className={styles.icons}>
            <button className={styles.iconBtn} aria-label="Recherche">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
              </svg>
            </button>
            <button className={styles.iconBtn} aria-label="Panier">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              <span className={styles.badge}>0</span>
            </button>
          </div>

          <button
            className={`${styles.burger} ${menuOpen ? styles.open : ""}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div className={`${styles.mobileMenu} ${menuOpen ? styles.open : ""}`}>
        {navLinks.map((l) => (
          <a key={l.label} href={l.href} className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
            {l.label}
          </a>
        ))}
        <div className={styles.mobileRule} />
      </div>
    </>
  );
}
