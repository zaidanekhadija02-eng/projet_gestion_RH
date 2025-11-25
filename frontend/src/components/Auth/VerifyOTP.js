import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./VerifyOTP.css";

function VerifyOTP() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const email = localStorage.getItem("resetEmail");

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message);
        return;
      }

      // Sauvegarder l'OTP validé pour reset-password
      localStorage.setItem("verifiedOTP", otp);

      navigate("/reset-password");
    } catch (err) {
      setMessage("Erreur serveur");
    }
  };

  return (
    <div className="otp-container">
      <form className="otp-form" onSubmit={handleVerify}>
        <h2>Vérification OTP</h2>

        <div className="otp-input-group">
          <input
            type="text"
            maxLength="6"
            placeholder="000000"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            required
          />
          <label>Entrez le code OTP envoyé à votre email</label>
        </div>

        <button type="submit" className="otp-button">Vérifier</button>

        {message && <p className="otp-error">{message}</p>}
      </form>
    </div>
  );
}

export default VerifyOTP;
