"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "../../carContext";
import styles from "./CartDrawer.module.css";

const WILAYAS = [
  "Alger",
  "Boumerdès",
  "Tizi Ouzou",
  "Bouira",
  "Béjaïa",
  "Blida",
  "Oran",
  "Constantine",
  "Annaba",
  "Sétif",
  "Batna",
  "Tlemcen",
  "Autre",
];

export default function CartDrawer() {
  const {
    items,
    isOpen,
    total,
    count,
    closeCart,
    removeItem,
    updateQty,
    clear,
  } = useCart();
  const [step, setStep] = useState<"cart" | "form">("cart");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ orderNumber: number } | null>(null);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    wilaya: "Alger",
    email: "",
    note: "",
  });

  const fmtPrice = (n: number) =>
    new Intl.NumberFormat("fr-DZ", {
      style: "currency",
      currency: "DZD",
      minimumFractionDigits: 0,
    }).format(n);

  async function submitOrder() {
    if (!form.fullName || !form.phone || !form.address) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({
            productId: i.id,
            productName: i.name,
            unitPrice: Number(i.price),
            quantity: i.quantity,
          })),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setDone({ orderNumber: data.orderNumber });
        clear();
      }
    } finally {
      setSubmitting(false);
    }
  }

  function handleClose() {
    closeCart();
    // reset après fermeture
    setTimeout(() => {
      setStep("cart");
      setDone(null);
      setForm({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        wilaya: "Alger",
        email: "",
        note: "",
      });
    }, 400);
  }

  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ""}`}
        onClick={handleClose}
      />
      <aside className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ""}`}>
        <div className={styles.head}>
          <span className={styles.headTitle}>
            {done
              ? "Commande confirmée"
              : step === "cart"
                ? `Panier (${count})`
                : "Vos informations"}
          </span>
          <button
            className={styles.closeBtn}
            onClick={handleClose}
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        {/* ===== CONFIRMATION ===== */}
        {done ? (
          <div className={styles.successWrap}>
            <div className={styles.successIcon}>✓</div>
            <h3 className={styles.successTitle}>Merci pour votre commande !</h3>
            <p className={styles.successText}>
              Votre commande <strong>#{done.orderNumber}</strong> a bien été
              reçue. Nous vous contacterons au plus vite pour la confirmation.
            </p>
            <button className={styles.primaryBtn} onClick={handleClose}>
              CONTINUER
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className={styles.empty}>
            <p>Votre panier est vide.</p>
            <button className={styles.ghostBtn} onClick={handleClose}>
              DÉCOUVRIR LA BOUTIQUE
            </button>
          </div>
        ) : step === "cart" ? (
          /* ===== ÉTAPE PANIER ===== */
          <>
            <div className={styles.list}>
              {items.map((it) => (
                <div className={styles.item} key={it.id}>
                  <div className={styles.itemImg}>
                    {it.image_url ? (
                      <Image
                        src={it.image_url}
                        alt={it.name}
                        width={70}
                        height={70}
                        style={{ objectFit: "cover", width: 70, height: 70 }}
                      />
                    ) : (
                      <div className={styles.itemNoImg}>C</div>
                    )}
                  </div>
                  <div className={styles.itemInfo}>
                    <span className={styles.itemName}>{it.name}</span>
                    {it.volume && (
                      <span className={styles.itemVol}>{it.volume}</span>
                    )}
                    <span className={styles.itemPrice}>
                      {fmtPrice(Number(it.price))}
                    </span>
                  </div>
                  <div className={styles.itemActions}>
                    <div className={styles.qty}>
                      <button onClick={() => updateQty(it.id, it.quantity - 1)}>
                        −
                      </button>
                      <span>{it.quantity}</span>
                      <button onClick={() => updateQty(it.id, it.quantity + 1)}>
                        +
                      </button>
                    </div>
                    <button
                      className={styles.remove}
                      onClick={() => removeItem(it.id)}
                    >
                      Retirer
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.footer}>
              <div className={styles.totalRow}>
                <span>TOTAL</span>
                <span className={styles.totalValue}>{fmtPrice(total)}</span>
              </div>
              <button
                className={styles.primaryBtn}
                onClick={() => setStep("form")}
              >
                PASSER LA COMMANDE
              </button>
            </div>
          </>
        ) : (
          /* ===== ÉTAPE FORMULAIRE ===== */
          <>
            <div className={styles.form}>
              <div className={styles.field}>
                <label>NOM COMPLET *</label>
                <input
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                  placeholder="Votre nom"
                />
              </div>
              <div className={styles.field}>
                <label>TÉLÉPHONE *</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="0X XX XX XX XX"
                />
              </div>
              <div className={styles.field}>
                <label>ADRESSE *</label>
                <input
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  placeholder="Rue, quartier..."
                />
              </div>
              <div className={styles.row2}>
                <div className={styles.field}>
                  <label>COMMUNE</label>
                  <input
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="Commune"
                  />
                </div>
                <div className={styles.field}>
                  <label>WILAYA</label>
                  <select
                    value={form.wilaya}
                    onChange={(e) =>
                      setForm({ ...form, wilaya: e.target.value })
                    }
                  >
                    {WILAYAS.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={styles.field}>
                <label>EMAIL (optionnel)</label>
                <input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="votre@email.com"
                />
              </div>
              <div className={styles.field}>
                <label>NOTE (optionnel)</label>
                <textarea
                  rows={2}
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder="Précisions sur la livraison..."
                />
              </div>
            </div>

            <div className={styles.footer}>
              <div className={styles.totalRow}>
                <span>TOTAL</span>
                <span className={styles.totalValue}>{fmtPrice(total)}</span>
              </div>
              <button
                className={styles.primaryBtn}
                onClick={submitOrder}
                disabled={
                  submitting || !form.fullName || !form.phone || !form.address
                }
              >
                {submitting ? "ENVOI..." : "ENVOYER LA COMMANDE"}
              </button>
              <button
                className={styles.backBtn}
                onClick={() => setStep("cart")}
              >
                ← Retour au panier
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
