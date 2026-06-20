"use client";

import { useReveal } from "../../hooks/useReveal";
import styles from "./Manifesto.module.css";

const steps = [
  {
    tag: "TERRE",
    title: "Là où tout commence",
    text: "Le figuier de barbarie pousse dans les conditions les plus extrêmes. Dans la sécheresse, dans le silence, dans la vérité brute de la pierre kabyle. C'est de cette terre que naît Cactuvia.",
  },
  {
    tag: "HÉRITAGE",
    title: "Le geste transmis",
    text: "Le gel de cactus est un savoir ancestral, transmis de main en main par les femmes kabyles. Un soin brut, naturel, sans transformation inutile - juste l'essence de la plante.",
  },
  {
    tag: "ESSENCE",
    title: "Le retour au simple",
    text: "Cactuvia ne cherche pas à transformer la nature, mais à la respecter dans son état le plus pur. Chaque formule est une promesse de clarté.",
  },
];

export default function Manifesto() {
  useReveal();

  return (
    <section id="apropos" className={styles.section}>
      <div className={styles.intro}>
        <div className={styles.introGrid}>
          <div className={`${styles.introMeta} reveal`}>
            <p className={styles.kicker}>QUI EST CACTUVIA</p>
            <div className={styles.rule} />
            Cactuvia est née d&apos;une conviction profonde: la beauté la plus
            authentique puise sa force dans la nature. Nos forumules sont un
            hommage à la terre, à ses plantes, à son savoir ancestral. Elles
            sont élaborées avec soin, révèlant le potentiel de chaque peau en
            harmonie avec la nature.
          </div>
          <h2 className={`${styles.introTitle} reveal reveal-d1`}>
            Une mémoire vivante née de la <em>terre et des plantes</em>
          </h2>
        </div>
      </div>

      <div className={styles.story}>
        <div className={styles.steps}>
          {steps.map((s, i) => (
            <div className={`${styles.step} reveal`} key={i}>
              <div className={styles.stepIndex}>0{i + 1}</div>
              <div>
                <p className={styles.stepTag}>{s.tag}</p>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepText}>{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.quote}>
        <div className={styles.quoteGlow} />
        <div className="reveal">
          <div className={styles.quoteMark}>&ldquo;</div>
          <blockquote className={styles.quoteText}>
            Un retour à l&apos;essentiel, guidé par le savoir de nos aïeux.
          </blockquote>
          <div className={styles.quoteRule} />
        </div>
      </div>

      <div className={`${styles.philo} reveal`}>
        <p>
          Cactuvia est une philosophie façonnée par la terre et les plantes,
          guidée par le respect du corps et de la nature. Chaque produit est
          pensé comme un rituel simple, pur et essentiel.
        </p>
      </div>
    </section>
  );
}
