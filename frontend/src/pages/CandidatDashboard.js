 import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from 'react-modal';
import axios from 'axios';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import './CandidatDashboard.css';

function CandidatDashboard() {
  const [activeTab, setActiveTab] = useState('accueil');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const idCandidat = user?.id_candidat;

  // --- Infos personnelles ---
  const [infos, setInfos] = useState(null);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [updatedInfos, setUpdatedInfos] = useState({});

  useEffect(() => {
    const fetchInfos = async () => {
      if (!idCandidat) return;
      try {
        const res = await axios.get(`http://localhost:8000/api/candidats/${idCandidat}`);
        setInfos(res.data);
      } catch (err) {
        console.error(err);
        alert("Impossible de récupérer vos informations !");
      }
    };
    fetchInfos();
  }, [idCandidat]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setUpdatedInfos(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveInfos = async () => {
    if (!idCandidat) return;
    try {
      await axios.put(`http://localhost:8000/api/candidats/${idCandidat}`, updatedInfos);
      alert("Informations mises à jour !");
      setModalEditOpen(false);
      setInfos({ ...infos, ...updatedInfos });
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour !");
    }
  };

  // --- Offres d'emploi ---
  const [offres, setOffres] = useState([]);
  useEffect(() => {
    const fetchOffres = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/offres");
        setOffres(res.data);
      } catch (err) {
        console.error(err);
        alert("Impossible de récupérer les offres !");
      }
    };
    fetchOffres();
  }, []);

  // --- Candidatures ---
  const [demandes, setDemandes] = useState([]);
  const fetchDemandes = async () => {
    if (!idCandidat) return;
    try {
      const res = await axios.get(`http://localhost:8000/api/demande-emplois/candidat/${idCandidat}`);
      setDemandes(res.data);
    } catch (err) {
      console.error(err);
      alert("Impossible de récupérer vos demandes !");
    }
  };

  useEffect(() => { fetchDemandes(); }, [idCandidat]);

  const handlePostuler = async (id_offre) => {
    if (!idCandidat) return;
    try {
      await axios.post("http://localhost:8000/api/demande-emplois", {
        id_candidat: idCandidat,
        id_offre
      });
      alert("Votre candidature a été envoyée !");
      fetchDemandes();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la postulation !");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'infos':
        return (
          <div className="infos-container">
            <h2>Mes Informations</h2>
            {infos && (
              <div className="infos-card">
                <p><strong>CIN:</strong> {infos.cin}</p>
                <p><strong>Nom:</strong> {infos.nom}</p>
                <p><strong>Prénom:</strong> {infos.prenom}</p>
                <p><strong>Email:</strong> {infos.email}</p>
                {infos.cv && <p><a href={`http://localhost:8000/uploads/${infos.cv}`} target="_blank" rel="noreferrer">Télécharger CV</a></p>}
                {infos.motivation && <p><a href={`http://localhost:8000/uploads/${infos.motivation}`} target="_blank" rel="noreferrer">Télécharger Lettre</a></p>}
                <button onClick={() => { setUpdatedInfos(infos); setModalEditOpen(true); }}>✏️ Modifier mes infos</button>
              </div>
            )}

            <Modal isOpen={modalEditOpen} onRequestClose={() => setModalEditOpen(false)} className="modal" overlayClassName="overlay">
              <h2>Modifier mes informations</h2>
              <form onSubmit={e => { e.preventDefault(); handleSaveInfos(); }}>
                <input type="text" name="nom" value={updatedInfos.nom || ''} onChange={handleEditChange} required />
                <input type="text" name="prenom" value={updatedInfos.prenom || ''} onChange={handleEditChange} required />
                <input type="email" name="email" value={updatedInfos.email || ''} onChange={handleEditChange} required />
                <button type="submit">💾 Sauvegarder</button>
              </form>
            </Modal>
          </div>
        );

      case 'offres':
  return (
    <div className="offres-container">
      <h2>Offres d'emploi</h2>
      <table>
        <thead>
          <tr>
            <th>Département</th>
            <th>Profession</th>
            <th>Date</th>
            <th>Type</th>
            <th>Détail</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {offres.map(o => (
            <tr key={o.id_offre}>
              <td>{o.departement}</td>
              <td>{o.profession}</td>
              <td>{o.date_pub}</td>
              <td>{o.type_emploi}</td>
              <td>
                {o.detail ? (
                  <a href={`http://localhost:8000/uploads/${o.detail}`} target="_blank" rel="noreferrer">
                    PDF
                  </a>
                ) : '—'}
              </td>
              <td>
                <button onClick={() => handlePostuler(o.id_offre)}>Postuler</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );


      case 'candidatures':
  return (
    <div className="candidatures-container">
      <h2>Mes Candidatures</h2>
      <table>
        <thead>
          <tr>
            <th>Département</th>
            <th>Profession</th>
            <th>Détails</th>
            <th>Type d'emploi</th>
            <th>État</th>
          </tr>
        </thead>
        <tbody>
          {demandes.map(d => (
            <tr key={d.id_offre}>
              <td>{d.departement}</td>
              <td>{d.profession}</td>
              <td>
                {d.detail ? (
                  <a href={`http://localhost:8000/uploads/${d.detail}`} target="_blank" rel="noreferrer">
                    ⬇
                  </a>
                ) : '—'}
              </td>
              <td>{d.type_emploi}</td>
              <td>
                {d.etat === 'Accepté' ? '✔️' : (d.etat === 'Refusé' ? '❌' : '⏳')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );


      default:
        return (
          <div className="welcome-card">
            <h2>Bienvenue, {user.nom} {user.prenom}</h2>
            <p>Bienvenue dans votre espace candidat.</p>
            <button onClick={() => setActiveTab('infos')}>À propos</button>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-page">
      <nav className="dashboard-nav">
        <div className="nav-logo">TeamLP</div>
        <ul className="nav-links">
          <li onClick={() => setActiveTab('accueil')} className={activeTab==='accueil' ? 'active' : ''}>Accueil</li>
          <li onClick={() => setActiveTab('infos')} className={activeTab==='infos' ? 'active' : ''}>Mes Infos</li>
          <li onClick={() => setActiveTab('offres')} className={activeTab==='offres' ? 'active' : ''}>Offres</li>
          <li onClick={() => setActiveTab('candidatures')} className={activeTab==='candidatures' ? 'active' : ''}>Mes Candidatures</li>
        </ul>
        <button className="logout-icon" onClick={handleLogout}>
          <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
      </nav>
      <main className="dashboard-content">{renderContent()}</main>
    </div>
  );
}

export default CandidatDashboard;
