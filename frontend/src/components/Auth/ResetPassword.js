import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ResetPassword.css";

function ResetPassword() {
  const navigate = useNavigate();
  const email = localStorage.getItem("resetEmail");
  const otp = localStorage.getItem("verifiedOTP");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      setMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          otp,
          new_password: password,
          new_password_confirmation: confirm
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message);
        return;
      }

      localStorage.removeItem("resetEmail");
      localStorage.removeItem("verifiedOTP");

      alert("Mot de passe réinitialisé avec succès!");
      navigate("/login");
    } catch (error) {
      setMessage("Erreur serveur");
    }
  };

  return (
    <div className="rp-container">
      <form className="rp-form" onSubmit={handleReset}>
        <h2>Nouveau mot de passe</h2>

        <div className="rp-input-group">
          <input
            type="password"
            placeholder="Entrez un nouveau mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label>Nouveau mot de passe</label>
        </div>

        <div className="rp-input-group">
          <input
            type="password"
            placeholder="Confirmez"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          <label>Confirmez le mot de passe</label>
        </div>

        <button type="submit" className="rp-button">Réinitialiser</button>

        {message && <p className="rp-error">{message}</p>}
      </form>
    </div>
  );
}

export default ResetPassword;
