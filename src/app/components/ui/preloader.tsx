"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./preloader.module.css";

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const DURATION = 5000; // 3.5s - mets entre 3000 et 5000
    const start = performance.now();

    let raf = 0;
    const tick = (now: number) => {
      const pct = Math.min(((now - start) / DURATION) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setDone(true), 400); // petit fondu avant de disparaître
      }
    };
    raf = requestAnimationFrame(tick);

    // bloque le scroll pendant le chargement
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (done) document.body.style.overflow = "";
  }, [done]);

  return (
    <div className={`${styles.preloader} ${done ? styles.hidden : ""}`}>
      <div className={styles.inner}>
        <Image
          src="/logo.png"
          alt="Cactuvia"
          width={200}
          height={120}
          priority
          className={styles.logo}
        />
        <div className={styles.barTrack}>
          <div className={styles.barFill} style={{ width: `${progress}%` }} />
        </div>
        <span className={styles.pct}>{Math.round(progress)}%</span>
      </div>
    </div>
  );
}
