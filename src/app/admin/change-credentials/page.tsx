"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import ui from "../admin-ui.module.css";

export default function ChangeCredentialsPage() {
  const router = useRouter();
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError("");
    setSuccess("");

    if (!newUsername || !newPassword) {
      setError("Tous les champs sont requis.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Le mot de passe doit faire au moins 8 caractères.");
      return;
    }
    if (newPassword !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/admin/change-credentials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newUsername, newPassword }),
    });
    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Une erreur est survenue.");
      return;
    }

    setSuccess("Identifiants mis à jour. Reconnexion requise...");
    // déconnexion : le token contient encore l'ancien mustChange
    setTimeout(() => {
      signOut({ callbackUrl: "/admin/login" });
    }, 1600);
  }

  return (
    <div className={ui.authShell}>
      <div className={ui.card}>
        <div className={ui.brand}>
          <span className={ui.brandName}>CACTUVIA</span>
          <span className={ui.brandSub}>ESPACE ADMIN</span>
        </div>

        <h1 className={ui.title}>Sécurisez votre compte</h1>
        <p className={ui.subtitle}>
          Pour votre sécurité, veuillez définir vos propres identifiants.
          Ceux-ci remplaceront ceux fournis par défaut.
        </p>

        {error && <div className={ui.error}>{error}</div>}
        {success && <div className={ui.success}>{success}</div>}

        <div className={ui.field}>
          <label className={ui.label}>NOUVEAU NOM D&apos;UTILISATEUR</label>
          <input
            className={ui.input}
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="votre identifiant"
          />
        </div>

        <div className={ui.field}>
          <label className={ui.label}>NOUVEAU MOT DE PASSE</label>
          <input
            className={ui.input}
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
          />
          <p className={ui.hint}>Minimum 8 caractères.</p>
        </div>

        <div className={ui.field}>
          <label className={ui.label}>CONFIRMER LE MOT DE PASSE</label>
          <input
            className={ui.input}
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••••••"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>

        <button
          className={ui.btn}
          onClick={handleSubmit}
          disabled={loading || !!success}
        >
          {loading ? "ENREGISTREMENT..." : "ENREGISTRER ET CONTINUER"}
        </button>

        <p className={ui.footNote}>
          Ces identifiants ne seront connus que de vous.
        </p>
      </div>
    </div>
  );
}
