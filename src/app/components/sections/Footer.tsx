import styles from "./Footer.module.css";

const columns = {
  BOUTIQUE: [
    "Soins Visage",
    "Soins Cheveux",
    "Soins Corps",
    "Coffrets Cadeaux",
    "Nouveautés",
  ],
  MARQUE: [
    "Notre Histoire",
    "Nos Ingrédients",
    "Nos Rituels",
    "La Fondatrice",
    "Philosophie",
  ],
  INFORMATIONS: ["Livraison", "Retours", "FAQ", "Contact", "Mentions Légales"],
};

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.main}>
        <div className={styles.grid}>
          <div>
            <span className={styles.brandName}>CACTUVIA</span>
            <span className={styles.brandSub}>SOINS NATURELS</span>
            <p className={styles.brandText}>
              Des cosmétiques naturelles façonnées par la terre, pour
              révéler la beauté authentique de chaque femme.
            </p>
            <div className={styles.socials}>
              {["INSTAGRAM", "TIKTOK", "PINTEREST"].map((s) => (
                <a key={s} href="#" className={styles.social}>
                  {s}
                </a>
              ))}
            </div>
          </div>
          {Object.entries(columns).map(([title, items]) => (
            <div key={title}>
              <p className={styles.colTitle}>{title}</p>
              <div className={styles.colList}>
                {items.map((it) => (
                  <a key={it} href="#" className={styles.colLink}>
                    {it}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.bottom}>
        <div className={styles.bottomInner}>
          <p className={styles.copy}>
            © {year} CACTUVIA - Tous droits réservés. Fait avec amour en Algérie.
          </p>
          <div className={styles.legal}>
            <a href="#" className={styles.legalLink}>
              POLITIQUE DE CONFIDENTIALITÉ
            </a>
            <a href="#" className={styles.legalLink}>
              CGV
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
