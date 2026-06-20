"use client";

import { useReveal } from "../../hooks/useReveal";
import styles from "./Journal.module.css";

const articles = [
  { category: "PLANTES", accent: "#a14e80", date: "Juin 2026", readTime: "5 min",
    title: "Le cactus, trésor méconnu des montagnes et du désert",
    excerpt: "Depuis des siècles, les femmes kabyles utilisaient le gel de cactus dans leurs rituels de beauté quotidiens. Découvrez l'histoire de cet ingrédient exceptionnel." },
  { category: "RITUELS", accent: "#76763a", date: "Mai 2026", readTime: "7 min",
    title: "Les gestes de beauté de nos grand-mères kabyles",
    excerpt: "Ces pratiques millénaires, transmises oralement de génération en génération, révèlent une sagesse profonde sur le soin du corps et de l'esprit." },
  { category: "INGRÉDIENTS", accent: "#c5a253", date: "Avril 2026", readTime: "6 min",
    title: "Comprendre les actifs naturels de la Kabylie",
    excerpt: "Un regard sur les plantes emblématiques de nos montagnes : pourquoi elles fonctionnent, et comment nos formules les préservent." },
];

export default function Journal() {
  useReveal();

  return (
    <section id="journal" className={styles.section}>
      <div className={styles.container}>
        <div className={`${styles.header} reveal`}>
          <div>
            <p className={styles.kicker}>SAVOIRS & RÉCITS</p>
            <h2 className={styles.title}>Le Journal</h2>
          </div>
          <a href="#" className={styles.viewAll}>TOUS LES ARTICLES<i /></a>
        </div>

        <div className={styles.grid}>
          {articles.map((a, i) => (
            <article className={`${styles.card} reveal reveal-d${i + 1}`} key={i}>
              <div className={styles.band} style={{ background: a.accent }} />
              <p className={styles.cat} style={{ color: a.accent }}>{a.category}</p>
              <h3 className={styles.atitle}>{a.title}</h3>
              <p className={styles.excerpt}>{a.excerpt}</p>
              <div className={styles.meta}>
                <div className={styles.metaLeft}>
                  <span className={styles.metaText}>{a.date}</span>
                  <span className={styles.metaDot}>·</span>
                  <span className={styles.metaText}>{a.readTime} de lecture</span>
                </div>
                <span className={styles.read}>LIRE →</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
