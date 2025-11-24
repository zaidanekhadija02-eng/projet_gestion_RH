import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post('http://localhost:8000/api/login', {
      email,
      password
    });

    console.log('Réponse reçue:', response.data);

    // Laravel retourne directement les données, pas dans un objet "user"
    const user = {
      id: response.data.id_personne,
      nom: response.data.nom,
      prenom: response.data.prenom,
      email: response.data.email,
      role: response.data.role
    };

    localStorage.setItem('user', JSON.stringify(user));

    // Redirection selon le rôle
    if (user.role === 'candidat') {
      navigate('/candidat-dashboard');
    } else if (user.role === 'employe') {
      navigate('/employe-dashboard');
    } else if (user.role === 'admin') {
      navigate('/admin-dashboard');
    } else {
      alert("Rôle inconnu !");
    }

  } catch (error) {
    console.error('Erreur complète:', error);
    
    if (error.response) {
      alert(`Erreur ${error.response.status}: ${error.response.data.message || 'Identifiants incorrects'}`);
    } else if (error.request) {
      alert("Backend indisponible ! Vérifiez que Laravel tourne sur le port 8000");
    } else {
      alert("Erreur : " + error.message);
    }
  }
};

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Bienvenue</h1>
        <p className="login-subtitle">Connectez-vous pour continuer</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              required
            />
            <label>Email</label>
          </div>

          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              required
            />
            <label>Mot de passe</label>
          </div>

          <button type="submit" className="ripple">Se connecter</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
