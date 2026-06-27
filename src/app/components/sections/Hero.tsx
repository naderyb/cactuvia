"use client";

import styles from "./Hero.module.css";
import Image from "next/image";

const values = [
  { num: "01", label: "Pureté & Transparence" },
  { num: "02", label: "Simplicité & Sécurité" },
  { num: "03", label: "Savoirs Ancestraux" },
  { num: "04", label: "Éco-Responsabilité" },
];

export default function Hero() {
  return (
    <section className={styles.hero} id="hero">
      <div className={styles.bg} />
      <div className={styles.grain} />

      <Image
        src="/logo.png"
        alt="Cactuvia"
        width={500}
        height={500}
        priority
        className={styles.ghost}
      />

      <div className={styles.inner}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            La beauté née
            <br />
            <em>de la terre</em>
          </h1>
          <p className={styles.lead}>
            Des formules nées du gel de figue de barbarie et des plantes de
            Kabylie. Une peau nourrie, lumineuse, vivante - révélée par la terre
            qui l&apos;a vue grandir.
          </p>
          <div className={styles.actions}>
            <a href="#apropos" className={styles.btnPrimary}>
              DÉCOUVRIR CACTUVIA
            </a>
          </div>
        </div>
      </div>

      <div className={styles.values}>
        <div className={styles.valuesInner}>
          {values.map((v, i) => (
            <div className={styles.valItem} key={i}>
              <span className={styles.valNum}>{v.num}</span>
              <span className={styles.valLabel}>{v.label.toUpperCase()}</span>
              {i < values.length - 1 && <span className={styles.valSep} />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
