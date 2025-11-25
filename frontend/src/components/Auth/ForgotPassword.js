import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message);
        return;
      }

      // Sauvegarder l'email pour la prochaine étape
      localStorage.setItem("resetEmail", email);
      
      // ⚠ Pour projet scolaire: afficher l'OTP
      alert(`Votre code OTP: ${data.otp}`);

      navigate("/verify-otp");
    } catch (error) {
      setMessage("Erreur serveur");
    }
  };

  return (
    <div className="fp-container">
      <form className="fp-form" onSubmit={handleSubmit}>
        <h2>Mot de passe oublié</h2>

        <div className="fp-input-group">
          <input
            type="email"
            placeholder="Entrez votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Email</label>
        </div>

        <button type="submit" className="fp-button">Envoyer OTP</button>

        {message && <p className="fp-error">{message}</p>}
      </form>
    </div>
  );
}

export default ForgotPassword;
