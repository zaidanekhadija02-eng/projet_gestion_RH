import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './InscriptionCandidat.css';

const API_URL = 'http://localhost:8000/api'; // Laravel tourne sur le port 8000
// adapte à ton backend

function InscriptionCandidat() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    confirmPassword: '',
    cin: '',
    cv: null,
    motivation: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }

    const data = new FormData();
    data.append('nom', formData.nom);
    data.append('prenom', formData.prenom);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('cin', formData.cin);
    if (formData.cv) data.append('cv', formData.cv);
    if (formData.motivation) data.append('motivation', formData.motivation);

try {
  const response = await axios.post(`${API_URL}/candidats`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  alert(response.data.message);
  navigate('/login');
} catch (err) {
  console.error('Erreur complète :', err.response); // Voir toute la réponse du serveur
  if (err.response) {
    // Affiche le message exact renvoyé par Laravel
    alert(err.response.data.message || JSON.stringify(err.response.data));
  } else {
    alert('Erreur lors de l’inscription : impossible de joindre le serveur');
  }
}


  };

  return (
    <div className="inscription-candidat-page">
      <div className="inscription-candidat-container">
        <h1>Inscription Candidat</h1>
        <p>Remplissez le formulaire pour postuler à une offre d'emploi</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input type="text" name="nom" value={formData.nom} onChange={handleChange} placeholder=" " required />
            <label>Nom</label>
          </div>
          <div className="input-group">
            <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} placeholder=" " required />
            <label>Prénom</label>
          </div>
          <div className="input-group">
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder=" " required />
            <label>Email</label>
          </div>
          <div className="input-group">
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder=" " required />
            <label>Mot de passe</label>
          </div>
          <div className="input-group">
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder=" " required />
            <label>Confirmer le mot de passe</label>
          </div>
          <div className="input-group">
            <input type="text" name="cin" value={formData.cin} onChange={handleChange} placeholder=" " required />
            <label>CIN</label>
          </div>
          <div className="input-group">
            <label>CV (PDF, DOC, DOCX)</label>
            <input type="file" name="cv" onChange={handleChange} accept=".pdf,.doc,.docx" required />
          </div>
          <div className="input-group">
            <label>Lettre de motivation (PDF, DOC, DOCX)</label>
            <input type="file" name="motivation" onChange={handleChange} accept=".pdf,.doc,.docx" required />
          </div>
          <button type="submit">S’inscrire</button>
        </form>
        <p className="login-link">
          Déjà inscrit ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}

export default InscriptionCandidat;
