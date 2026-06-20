"use client";

import { useReveal } from "../../hooks/useReveal";
import styles from "./Ingredients.module.css";

const rays = [0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
  const x1 = Math.round((100 + 10 * Math.cos((angle * Math.PI) / 180)) * 100) / 100;
  const y1 = Math.round((70 + 10 * Math.sin((angle * Math.PI) / 180)) * 100) / 100;
  const x2 = Math.round((100 + 20 * Math.cos((angle * Math.PI) / 180)) * 100) / 100;
  const y2 = Math.round((70 + 20 * Math.sin((angle * Math.PI) / 180)) * 100) / 100;
  return { x1, y1, x2, y2 };
});

const ingredients = [
  {
    name: "Huile de Figuier de Barbarie",
    latin: "Opuntia ficus-indica seed oil",
    origin: "MONTAGNES KABYLES",
    benefits: ["Anti-âge", "Régénérante", "Nourrissante"],
    text: "L'une des huiles les plus précieuses au monde, extraite des graines du figuier de barbarie. Riche en vitamine E et en acides gras essentiels.",
  },
  {
    name: "Argile Blanche de Kabylie",
    latin: "Kaolin",
    origin: "HAUTE-KABYLIE",
    benefits: ["Purifiante", "Équilibrante", "Douce"],
    text: "Argile traditionnelle utilisée depuis des siècles par les femmes kabyles pour purifier et embellir la peau naturellement.",
  },
];

export default function Ingredients() {
  useReveal();

  return (
    <section id="ingredients" className={styles.section}>
      <div className={styles.ghost}>CACTUS</div>
      <div className={styles.container}>
        <div className={`${styles.head} reveal`}>
          <p className={styles.kicker}>NOS INGRÉDIENTS</p>
          <h2 className={styles.title}>La puissance de la <em>nature</em></h2>
        </div>

        <div className={`${styles.feature} reveal`}>
          <div className={styles.featureVisual}>
            <svg className={styles.featureCactus} width="200" height="240" viewBox="0 0 200 240" fill="none">
              <rect x="90" y="80" width="20" height="160" rx="10" fill="none" stroke="#76763a" strokeWidth="1.5" />
              <path d="M90 130 Q50 130 50 90 Q50 70 65 70" stroke="#76763a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <path d="M110 150 Q150 150 150 110 Q150 90 135 90" stroke="#76763a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <circle cx="100" cy="70" r="18" stroke="#c5a253" strokeWidth="1" fill="none" />
              <circle cx="100" cy="70" r="8" fill="#c5a253" opacity="0.4" />
              {rays.map((r, i) => (
                <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} stroke="#c5a253" strokeWidth="1" opacity="0.7" />
              ))}
            </svg>
            <svg className={styles.ring} viewBox="0 0 400 400">
              <defs>
                <path id="ingCircle" d="M 200,200 m -140,0 a 140,140 0 1,1 280,0 a 140,140 0 1,1 -280,0" />
              </defs>
              <text style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fill: "#FBF9F5", letterSpacing: "8px" }}>
                <textPath href="#ingCircle">GEL DE CACTUS · OPUNTIA FICUS-INDICA · ALGÉRIE ·</textPath>
              </text>
            </svg>
          </div>

          <div className={styles.featureInfo}>
            <p className={styles.fKicker}>INGRÉDIENT SIGNATURE</p>
            <h3 className={styles.fName}>Gel de Cactus</h3>
            <p className={styles.fLatin}>Opuntia ficus-indica</p>
            <p className={styles.fText}>
              Transmis de génération en génération, ce gel précieux est au cœur
              de chaque formule Cactuvia. Le figuier de barbarie porte une grande
              importance: c&apos;est un symbole de résilience,
              d&apos;attachement à la terre et de générosité.
            </p>
            <div className={styles.benefits}>
              {["Hydratation & nutrition profonde", "Cicatrisant & régénérant", "Riche en antioxydants", "Soutient le microbiome cutané"].map((b, i) => (
                <div className={styles.benefit} key={i}>
                  <span className={styles.dot} />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.grid}>
          {ingredients.map((ing, i) => (
            <div className={`${styles.ingCard} reveal reveal-d${i + 1}`} key={i}>
              <p className={styles.ingOrigin}>{ing.origin}</p>
              <h4 className={styles.ingName}>{ing.name}</h4>
              <p className={styles.ingLatin}>{ing.latin}</p>
              <p className={styles.ingText}>{ing.text}</p>
              <div className={styles.chips}>
                {ing.benefits.map((b, j) => <span className={styles.chip} key={j}>{b}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
