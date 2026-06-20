"use client";

import { useReveal } from "../../hooks/useReveal";
import styles from "./Boutique.module.css";

const products = [
  { name: "Baume Nourrissant Cheveux", sub: "Répare, hydrate et illumine", vol: "50 ml", cat: "SOIN CAPILLAIRE", bg: "#f7edf3", tube: "#a14e80", tag: "BESTSELLER" },
  { name: "Crème Visage Anti-Âge", sub: "Liftante, repulpante, apaisante", vol: "30 ml", cat: "SOIN VISAGE", bg: "#f3f3ea", tube: "#76763a", tag: "NOUVEAU" },
  { name: "Baume Nourrissant Mains", sub: "Répare, hydrate et nourrit", vol: "30 ml", cat: "SOIN CORPS", bg: "#f4efe7", tube: "#a14e80", tag: "" },
  { name: "Sérum Gel de Cactus Pur", sub: "Hydratation profonde, éclat naturel", vol: "30 ml", cat: "SOIN VISAGE", bg: "#eef0e6", tube: "#5a5a28", tag: "SIGNATURE" },
];

export default function Boutique() {
  useReveal();

  return (
    <section id="boutique" className={styles.section}>
      <div className={styles.container}>
        <div className={`${styles.header} reveal`}>
          <div>
            <p className={styles.kicker}>NOS SOINS</p>
            <h2 className={styles.title}>La Boutique</h2>
          </div>
          <a href="#" className={styles.viewAll}>VOIR TOUT<i /></a>
        </div>

        <div className={styles.grid}>
          {products.map((p, i) => (
            <article className={`${styles.card} reveal reveal-d${(i % 4) + 1}`} key={i}>
              <div className={styles.visual} style={{ background: p.bg }}>
                {p.tag && <span className={styles.tag}>{p.tag}</span>}
                <div className={styles.tubeWrap}>
                  <div className={styles.tube} style={{ border: `1px solid ${p.tube}25` }}>
                    <span className={styles.tubeBand} style={{ background: `${p.tube}14` }} />
                    <svg className={styles.tubeIcon} width="28" height="28" viewBox="0 0 40 40" fill="none">
                      <circle cx="20" cy="12" r="8" stroke={p.tube} strokeWidth="1.2" fill="none" />
                      <path d="M20 4 L20 20" stroke={p.tube} strokeWidth="1.2" />
                      <path d="M14 8 L26 16 M26 8 L14 16" stroke={p.tube} strokeWidth="0.8" />
                      <line x1="20" y1="22" x2="20" y2="36" stroke={p.tube} strokeWidth="1.2" />
                      <circle cx="20" cy="30" r="2" fill={p.tube} />
                    </svg>
                    <span className={styles.tubeName} style={{ color: p.tube }}>CACTUVIA</span>
                  </div>
                  <div className={styles.cap} style={{ background: p.tube }} />
                </div>
                <span className={styles.glow} style={{ background: `radial-gradient(circle at center, ${p.tube}18 0%, transparent 70%)` }} />
              </div>

              <div className={styles.info}>
                <p className={styles.cat}>{p.cat}</p>
                <h3 className={styles.name}>{p.name}</h3>
                <p className={styles.sub}>{p.sub}</p>
                <div className={styles.row}>
                  <span className={styles.vol}>{p.vol}</span>
                  <button className={styles.add}>AJOUTER</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
