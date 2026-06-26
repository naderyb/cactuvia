"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
// import { useCart } from "../context/carContext";
import Navbar from "../components/ui/Navbar";
import Footer from "../components/sections/Footer";
import styles from "./boutique.module.css";

interface Product {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  subtitle: string | null;
  price: number;
  volume: string | null;
  image_url: string | null;
  tag: string | null;
}

type SortKey = "recent" | "price-asc" | "price-desc";

export default function BoutiquePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [sort, setSort] = useState<SortKey>("recent");
  // const { addItem } = useCart();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/products");
        if (res.ok) setProducts(await res.json());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // catégories uniques pour les filtres
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.category && set.add(p.category));
    return ["ALL", ...Array.from(set)];
  }, [products]);

  const filtered = useMemo(() => {
    let list = [...products];

    if (category !== "ALL") {
      list = list.filter((p) => p.category === category);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.subtitle?.toLowerCase().includes(q) ?? false) ||
          (p.description?.toLowerCase().includes(q) ?? false),
      );
    }
    if (sort === "price-asc")
      list.sort((a, b) => Number(a.price) - Number(b.price));
    else if (sort === "price-desc")
      list.sort((a, b) => Number(b.price) - Number(a.price));
    // "recent" : ordre déjà renvoyé par l'API

    return list;
  }, [products, category, search, sort]);

  const fmtPrice = (n: number) =>
    new Intl.NumberFormat("fr-DZ", {
      style: "currency",
      currency: "DZD",
      minimumFractionDigits: 0,
    }).format(n);

  return (
    <>
      <Navbar />
      <main className={styles.page}>
        {/* en-tête de page */}
        <header className={styles.hero}>
          <p className={styles.kicker}>COSMÉTIQUES NATURELS · KABYLIE</p>
          <h1 className={styles.title}>La Boutique</h1>
          <p className={styles.lead}>
            Toute la collection Cactuvia - des soins nés du gel de figue de
            barbarie et des plantes de Kabylie.
          </p>
        </header>

        {/* barre de contrôles */}
        <div className={styles.controls}>
          <div className={styles.searchWrap}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
            <input
              className={styles.search}
              placeholder="Rechercher un produit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className={styles.sortWrap}>
            <select
              className={styles.sort}
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
            >
              <option value="recent">Nouveautés</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
            </select>
          </div>
        </div>

        {/* filtres catégories */}
        <div className={styles.cats}>
          {categories.map((c) => (
            <button
              key={c}
              className={`${styles.catBtn} ${category === c ? styles.catActive : ""}`}
              onClick={() => setCategory(c)}
            >
              {c === "ALL" ? "Tout" : c}
            </button>
          ))}
        </div>

        {/* grille */}
        {loading ? (
          <div className={styles.stateMsg}>Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className={styles.stateMsg}>
            Aucun produit ne correspond à votre recherche.
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map((p) => (
              <article className={styles.card} key={p.id}>
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
                  {/* <button
                    className={styles.add}
                    onClick={() =>
                      addItem({
                        id: p.id,
                        name: p.name,
                        price: Number(p.price),
                        image_url: p.image_url,
                        volume: p.volume,
                      })
                    }
                  >
                    AJOUTER AU PANIER
                  </button> */}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
