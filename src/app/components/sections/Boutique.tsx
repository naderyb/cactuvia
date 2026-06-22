"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useReveal } from "../../hooks/useReveal";
import styles from "./Boutique.module.css";

interface Product {
  id: string;
  name: string;
  category: string | null;
  subtitle: string | null;
  price: number;
  volume: string | null;
  image_url: string | null;
  tag: string | null;
}

export default function Boutique() {
  useReveal();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/products?featured=true&limit=4");
        if (res.ok) setProducts(await res.json());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const fmtPrice = (n: number) =>
    new Intl.NumberFormat("fr-DZ", {
      style: "currency",
      currency: "DZD",
      minimumFractionDigits: 0,
    }).format(n);

  return (
    <section id="boutique" className={styles.section}>
      <div className={styles.container}>
        <div className={`${styles.header} reveal`}>
          <div>
            <p className={styles.kicker}>NOS SOINS</p>
            <h2 className={styles.title}>La Boutique</h2>
          </div>
          <a href="/boutique" className={styles.viewAll}>
            VOIR TOUT
            <i />
          </a>
        </div>

        {loading ? (
          <div className={styles.stateMsg}>Chargement des produits...</div>
        ) : products.length === 0 ? (
          <div className={styles.stateMsg}>
            Aucun produit disponible pour le moment.
          </div>
        ) : (
          <div className={styles.grid}>
            {products.map((p, i) => (
              <article
                className={`${styles.card} reveal reveal-d${(i % 4) + 1}`}
                key={p.id}
              >
                <div className={styles.visual}>
                  {p.tag && <span className={styles.tag}>{p.tag}</span>}
                  {p.image_url ? (
                    <Image
                      src={p.image_url}
                      alt={p.name}
                      width={400}
                      height={400}
                      className={styles.photo}
                    />
                  ) : (
                    <div className={styles.noPhoto}>Cactuvia</div>
                  )}
                </div>
                <div className={styles.info}>
                  {p.category && <p className={styles.cat}>{p.category}</p>}
                  <h3 className={styles.name}>{p.name}</h3>
                  {p.subtitle && <p className={styles.sub}>{p.subtitle}</p>}
                  <div className={styles.row}>
                    <span className={styles.price}>
                      {fmtPrice(Number(p.price))}
                    </span>
                    {p.volume && <span className={styles.vol}>{p.volume}</span>}
                  </div>
                  <button className={styles.add}>AJOUTER AU PANIER</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
