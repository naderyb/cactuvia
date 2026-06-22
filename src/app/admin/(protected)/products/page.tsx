"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import styles from "./products.module.css";

interface Product {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  subtitle: string | null;
  price: number;
  volume: string | null;
  image_url: string | null;
  image_public_id: string | null;
  tag: string | null;
}

const EMPTY: Partial<Product> = {
  name: "",
  description: "",
  category: "",
  subtitle: "",
  price: 0,
  volume: "",
  image_url: "",
  image_public_id: "",
  tag: "",
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      if (res.ok) setProducts(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  function openCreate() {
    setEditing({ ...EMPTY });
    setModalOpen(true);
  }
  function openEdit(p: Product) {
    setEditing({ ...p });
    setModalOpen(true);
  }
  function closeModal() {
    setModalOpen(false);
    setEditing(null);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editing) return;

    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
      );

      const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloud}/image/upload`,
        {
          method: "POST",
          body: form,
        },
      );
      const data = await res.json();
      if (data.secure_url) {
        setEditing((prev) => ({
          ...prev!,
          image_url: data.secure_url,
          image_public_id: data.public_id,
        }));
      }
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    if (!editing?.name) return;
    setSaving(true);
    try {
      const payload = {
        name: editing.name,
        description: editing.description,
        category: editing.category,
        subtitle: editing.subtitle,
        price: Number(editing.price) || 0,
        volume: editing.volume,
        imageUrl: editing.image_url,
        imagePublicId: editing.image_public_id,
        tag: editing.tag,
      };

      const res = editing.id
        ? await fetch(`/api/admin/products/${editing.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/admin/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      if (res.ok) {
        closeModal();
        load();
      }
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    const res = await fetch(`/api/admin/products/${deleteId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== deleteId));
    }
    setDeleteId(null);
  }

  const fmtPrice = (n: number) =>
    new Intl.NumberFormat("fr-DZ", {
      style: "currency",
      currency: "DZD",
      minimumFractionDigits: 0,
    }).format(n);

  return (
    <div>
      <div className={styles.header}>
        <div>
          <p className={styles.kicker}>BOUTIQUE</p>
          <h1 className={styles.title}>Produits</h1>
        </div>
        <button className={styles.addBtn} onClick={openCreate}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          AJOUTER UN PRODUIT
        </button>
      </div>

      {loading ? (
        <div className={styles.empty}>Chargement...</div>
      ) : products.length === 0 ? (
        <div className={styles.empty}>
          Aucun produit. Cliquez sur « Ajouter un produit ».
        </div>
      ) : (
        <div className={styles.grid}>
          {products.map((p) => (
            <div key={p.id} className={styles.card}>
              <div className={styles.cardImg}>
                {p.image_url ? (
                  <Image
                    src={p.image_url}
                    alt={p.name}
                    width={300}
                    height={300}
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                ) : (
                  <div className={styles.noImg}>Pas d&apos;image</div>
                )}
                {p.tag && <span className={styles.tag}>{p.tag}</span>}
              </div>
              <div className={styles.cardBody}>
                {p.category && <span className={styles.cat}>{p.category}</span>}
                <h3 className={styles.name}>{p.name}</h3>
                {p.subtitle && <p className={styles.sub}>{p.subtitle}</p>}
                <div className={styles.cardFoot}>
                  <span className={styles.price}>
                    {fmtPrice(Number(p.price))}
                  </span>
                  {p.volume && <span className={styles.vol}>{p.volume}</span>}
                </div>
                <div className={styles.actions}>
                  <button
                    className={styles.editBtn}
                    onClick={() => openEdit(p)}
                  >
                    Modifier
                  </button>
                  <button
                    className={styles.delBtn}
                    onClick={() => setDeleteId(p.id)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== MODAL AJOUT / MODIF ===== */}
      {modalOpen && editing && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHead}>
              <h2 className={styles.modalTitle}>
                {editing.id ? "Modifier le produit" : "Nouveau produit"}
              </h2>
              <button className={styles.closeBtn} onClick={closeModal}>
                ✕
              </button>
            </div>

            <div className={styles.modalBody}>
              {/* Upload image */}
              <div className={styles.uploadZone}>
                {editing.image_url ? (
                  <div className={styles.preview}>
                    <Image
                      src={editing.image_url}
                      alt=""
                      width={120}
                      height={120}
                      style={{
                        objectFit: "cover",
                        width: "120px",
                        height: "120px",
                        borderRadius: 4,
                      }}
                    />
                    <label className={styles.changeImg}>
                      Changer
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleUpload}
                      />
                    </label>
                  </div>
                ) : (
                  <label className={styles.uploadLabel}>
                    {uploading ? "Envoi en cours..." : "+ Ajouter une photo"}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleUpload}
                      disabled={uploading}
                    />
                  </label>
                )}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>NOM DU PRODUIT *</label>
                <input
                  className={styles.input}
                  value={editing.name || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, name: e.target.value })
                  }
                  placeholder="Baume Nourrissant Cheveux"
                />
              </div>

              <div className={styles.row2}>
                <div className={styles.field}>
                  <label className={styles.label}>CATÉGORIE</label>
                  <input
                    className={styles.input}
                    value={editing.category || ""}
                    onChange={(e) =>
                      setEditing({ ...editing, category: e.target.value })
                    }
                    placeholder="SOIN CAPILLAIRE"
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>TAG</label>
                  <input
                    className={styles.input}
                    value={editing.tag || ""}
                    onChange={(e) =>
                      setEditing({ ...editing, tag: e.target.value })
                    }
                    placeholder="BESTSELLER"
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>SOUS-TITRE</label>
                <input
                  className={styles.input}
                  value={editing.subtitle || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, subtitle: e.target.value })
                  }
                  placeholder="Répare, hydrate et illumine"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>DESCRIPTION</label>
                <textarea
                  className={styles.textarea}
                  rows={3}
                  value={editing.description || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, description: e.target.value })
                  }
                  placeholder="Description détaillée du produit..."
                />
              </div>

              <div className={styles.row2}>
                <div className={styles.field}>
                  <label className={styles.label}>PRIX (DZD)</label>
                  <input
                    className={styles.input}
                    type="number"
                    value={editing.price ?? 0}
                    onChange={(e) =>
                      setEditing({ ...editing, price: Number(e.target.value) })
                    }
                    placeholder="2500"
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>VOLUME</label>
                  <input
                    className={styles.input}
                    value={editing.volume || ""}
                    onChange={(e) =>
                      setEditing({ ...editing, volume: e.target.value })
                    }
                    placeholder="50 ml"
                  />
                </div>
              </div>
            </div>

            <div className={styles.modalFoot}>
              <button className={styles.cancelBtn} onClick={closeModal}>
                Annuler
              </button>
              <button
                className={styles.saveBtn}
                onClick={save}
                disabled={saving || uploading || !editing.name}
              >
                {saving
                  ? "ENREGISTREMENT..."
                  : editing.id
                    ? "ENREGISTRER"
                    : "AJOUTER"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== CONFIRM SUPPRESSION ===== */}
      {deleteId && (
        <div className={styles.modalOverlay} onClick={() => setDeleteId(null)}>
          <div
            className={styles.confirmBox}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={styles.confirmTitle}>Supprimer ce produit ?</h3>
            <p className={styles.confirmText}>
              Le produit sera retiré de la boutique. Les commandes passées ne
              sont pas affectées.
            </p>
            <div className={styles.confirmActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setDeleteId(null)}
              >
                Annuler
              </button>
              <button className={styles.confirmDel} onClick={confirmDelete}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
