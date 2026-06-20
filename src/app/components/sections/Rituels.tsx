"use client";

import { useReveal } from "../../hooks/useReveal";
import styles from "./Rituels.module.css";

const rituels = [
  { number: "01", title: "Rituel Visage", subtitle: "LE SOIN DU MATIN", duration: "5 min",
    description: "Commencez la journée avec le gel de cactus pur, suivi de la crème anti-âge. Un geste simple hérité de nos aïeules pour une peau éclatante.",
    steps: ["Nettoyer le visage à l'eau froide", "Appliquer le sérum gel de cactus", "Masser jusqu'à absorption complète", "Finaliser avec la crème protectrice"] },
  { number: "02", title: "Rituel Cheveux", subtitle: "LE MASQUE HEBDOMADAIRE", duration: "30 min",
    description: "Une fois par semaine, offrez à vos cheveux le baume nourrissant enrichi en plantes kabyles pour une chevelure forte et lumineuse.",
    steps: ["Appliquer sur cheveux humides", "Masser du cuir chevelu aux pointes", "Laisser poser 20 à 30 minutes", "Rincer à l'eau tiède"] },
  { number: "03", title: "Rituel Corps", subtitle: "LE SOIN DU SOIR", duration: "3 min",
    description: "Le rituel de fin de journée : un moment de reconnexion avec soi. Le baume mains nourrit et répare pendant le sommeil.",
    steps: ["Exfolier doucement les mains", "Appliquer le baume nourrissant", "Masser en mouvements circulaires", "Laisser agir toute la nuit"] },
];

export default function Rituels() {
  useReveal();

  return (
    <section id="rituels" className={styles.section}>
      <div className={styles.container}>
        <div className={`${styles.head} reveal`}>
          <p className={styles.kicker}>RITUELS ANCESTRAUX</p>
          <h2 className={styles.title}>Des gestes transmis <em>de mère en fille</em></h2>
          <p className={styles.intro}>
            Chaque soin Cactuvia s&apos;inscrit dans une tradition de gestes
            simples et efficaces, hérités des femmes kabyles qui connaissaient la
            puissance des plantes bien avant les laboratoires modernes.
          </p>
        </div>

        <div className={styles.list}>
          {rituels.map((r, i) => (
            <div className={`${styles.row} reveal`} key={i}>
              <div className={styles.num}><span className={styles.numText}>{r.number}</span></div>
              <div className={styles.body}>
                <p className={styles.sub}>{r.subtitle}</p>
                <h3 className={styles.rtitle}>{r.title}</h3>
                <p className={styles.desc}>{r.description}</p>
                <span className={styles.duration}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                  </svg>
                  {r.duration}
                </span>
              </div>
              <div className={styles.steps}>
                <p className={styles.stepsLabel}>ÉTAPES</p>
                {r.steps.map((s, j) => (
                  <div className={styles.stepItem} key={j}>
                    <span className={styles.stepNum}>{j + 1}</span>
                    <span className={styles.stepText}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
