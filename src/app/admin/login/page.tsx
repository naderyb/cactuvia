"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import ui from "../admin-ui.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError("");
    if (!username || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    setLoading(true);

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Identifiants incorrects.");
      return;
    }
    // le middleware redirige vers change-credentials si nécessaire
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className={ui.authShell}>
      <div className={ui.card}>
        <div className={ui.brand}>
          <span className={ui.brandName}>CACTUVIA</span>
          <span className={ui.brandSub}>ESPACE ADMIN</span>
        </div>

        <h1 className={ui.title}>Connexion</h1>
        <p className={ui.subtitle}>Accédez à votre tableau de bord</p>

        {error && <div className={ui.error}>{error}</div>}

        <div className={ui.field}>
          <label className={ui.label}>NOM D&apos;UTILISATEUR</label>
          <input
            className={ui.input}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="admin"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>

        <div className={ui.field}>
          <label className={ui.label}>MOT DE PASSE</label>
          <input
            className={ui.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>

        <button className={ui.btn} onClick={handleSubmit} disabled={loading}>
          {loading ? "CONNEXION..." : "SE CONNECTER"}
        </button>

        <p className={ui.footNote}>CACTUVIA · SOINS NATURELS · ALGÉRIE</p>
      </div>
    </div>
  );
}
