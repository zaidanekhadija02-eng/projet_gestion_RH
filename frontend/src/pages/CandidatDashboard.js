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
  const [newCV, setNewCV] = useState(null);
  const [newLettre, setNewLettre] = useState(null);

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

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'cv') {
      setNewCV(files[0]);
    } else if (name === 'lettre') {
      setNewLettre(files[0]);
    }
  };

  const handleSaveInfos = async () => {
    if (!idCandidat) return;
    
    try {
      const formData = new FormData();
      
      // Ajouter les champs texte modifiés
      if (updatedInfos.nom) formData.append('nom', updatedInfos.nom);
      if (updatedInfos.prenom) formData.append('prenom', updatedInfos.prenom);
      if (updatedInfos.email) formData.append('email', updatedInfos.email);
      if (updatedInfos.ville) formData.append('ville', updatedInfos.ville);
      
      // Ajouter les nouveaux fichiers si sélectionnés
      if (newCV) formData.append('cv', newCV);
      if (newLettre) formData.append('lettre', newLettre);

      await axios.post(`http://localhost:8000/api/candidats/${idCandidat}?_method=PUT`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      alert("Informations mises à jour !");
      setModalEditOpen(false);
      
      // Recharger les infos
      const res = await axios.get(`http://localhost:8000/api/candidats/${idCandidat}`);
      setInfos(res.data);
      
      // Réinitialiser les fichiers
      setNewCV(null);
      setNewLettre(null);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour : " + (err.response?.data?.message || err.message));
    }
  };

  // --- Offres d'emploi ---
  const [offres, setOffres] = useState([]);
  useEffect(() => {
    const fetchOffres = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/offres");
        console.log("Offres reçues:", res.data); // Pour déboguer
        
        // Filtrer les offres non terminées (termine = 0 ou null)
        const offresActives = res.data.filter(o => !o.termine || o.termine === 0);
        console.log("Offres actives:", offresActives); // Pour déboguer
        
        setOffres(offresActives);
      } catch (err) {
        console.error("Erreur récupération offres:", err);
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
    
    // Vérifier si déjà postulé
    const dejaPostule = demandes.some(d => d.id_offre === id_offre);
    if (dejaPostule) {
      alert("Vous avez déjà postulé à cette offre !");
      return;
    }

    try {
      await axios.post("http://localhost:8000/api/demande-emplois", {
        id_candidat: idCandidat,
        id_offre
      });
      alert("Votre candidature a été envoyée !");
      fetchDemandes();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Erreur lors de la postulation !");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getStatusBadge = (etat) => {
    if (etat === 'Accepté') {
      return <span className="badge badge-accepted">✔️ Accepté</span>;
    } else if (etat === 'Refusé') {
      return <span className="badge badge-rejected">❌ Refusé</span>;
    } else {
      return <span className="badge badge-pending">⏳ En attente</span>;
    }
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
                {infos.cv && <p><a href={`http://localhost:8000/uploads/${infos.cv}`} target="_blank" rel="noreferrer">📄 Télécharger CV</a></p>}
                {infos.motivation && <p><a href={`http://localhost:8000/uploads/${infos.motivation}`} target="_blank" rel="noreferrer">📄 Télécharger Lettre</a></p>}
                <button onClick={() => { setUpdatedInfos(infos); setModalEditOpen(true); }}>✏️ Modifier mes infos</button>
              </div>
            )}

            <Modal isOpen={modalEditOpen} onRequestClose={() => setModalEditOpen(false)} className="modal enhanced-modal" overlayClassName="overlay">
              <h2>Modifier mes informations</h2>
              <button className="close-btn" onClick={() => setModalEditOpen(false)}>×</button>
              
              <form onSubmit={e => { e.preventDefault(); handleSaveInfos(); }} className="edit-form">
                <div className="form-group">
                  <label>CIN</label>
                  <input type="text" name="cin" value={updatedInfos.cin || ''} disabled className="disabled-input" />
                </div>

                <div className="form-group">
                  <label>Nom</label>
                  <input type="text" name="nom" value={updatedInfos.nom || ''} onChange={handleEditChange} required />
                </div>
                
                <div className="form-group">
                  <label>Prénom</label>
                  <input type="text" name="prenom" value={updatedInfos.prenom || ''} onChange={handleEditChange} required />
                </div>
                
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" value={updatedInfos.email || ''} onChange={handleEditChange} required />
                </div>

                <div className="form-group">
                  <label>Ville</label>
                  <input type="text" name="ville" value={updatedInfos.ville || ''} onChange={handleEditChange} />
                </div>

                <div className="files-section">
                  <div className="file-item">
                    <label>CV actuel:</label>
                    {updatedInfos.cv ? (
                      <a href={`http://localhost:8000/uploads/${updatedInfos.cv}`} target="_blank" rel="noreferrer" className="download-link">
                        📄 Télécharger CV
                      </a>
                    ) : (
                      <span>Aucun CV</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Nouveau CV (optionnel)</label>
                    <input type="file" name="cv" accept="application/pdf" onChange={handleFileChange} />
                  </div>

                  <div className="file-item">
                    <label>Lettre actuelle:</label>
                    {updatedInfos.motivation ? (
                      <a href={`http://localhost:8000/uploads/${updatedInfos.motivation}`} target="_blank" rel="noreferrer" className="download-link">
                        📄 Télécharger Lettre
                      </a>
                    ) : (
                      <span>Aucune lettre</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Nouvelle lettre (optionnel)</label>
                    <input type="file" name="lettre" accept="application/pdf" onChange={handleFileChange} />
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="btn-save">💾 Sauvegarder</button>
                  <button type="button" className="btn-cancel" onClick={() => setModalEditOpen(false)}>❌ Annuler</button>
                </div>
              </form>
            </Modal>
          </div>
        );

      case 'offres':
        return (
          <div className="offres-container">
            <h2>Offres d'emploi disponibles</h2>
            {offres.length === 0 ? (
              <p>Aucune offre disponible pour le moment.</p>
            ) : (
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
                  {offres.map(o => {
                    const dejaPostule = demandes.some(d => d.id_offre === o.id_offre);
                    return (
                      <tr key={o.id_offre}>
                        <td>{o.departement}</td>
                        <td>{o.profession}</td>
                        <td>{o.date_pub}</td>
                        <td>{o.type_emploi}</td>
                        <td>
                          {o.detail ? (
                            <a href={`http://localhost:8000/uploads/${o.detail}`} target="_blank" rel="noreferrer">
                              📄 PDF
                            </a>
                          ) : '—'}
                        </td>
                        <td>
                          {dejaPostule ? (
                            <span className="already-applied">✓ Déjà postulé</span>
                          ) : (
                            <button onClick={() => handlePostuler(o.id_offre)} className="btn-postuler">
                              Postuler
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        );

      case 'candidatures':
        return (
          <div className="candidatures-container">
            <h2>Mes Candidatures</h2>
            {demandes.length === 0 ? (
              <p>Vous n'avez pas encore postulé à des offres.</p>
            ) : (
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
                    <tr key={`${d.id_candidat}-${d.id_offre}`}>
                      <td>{d.departement}</td>
                      <td>{d.profession}</td>
                      <td>
                        {d.detail ? (
                          <a href={`http://localhost:8000/uploads/${d.detail}`} target="_blank" rel="noreferrer">
                            📄 Voir détails
                          </a>
                        ) : '—'}
                      </td>
                      <td>{d.type_emploi}</td>
                      <td>{getStatusBadge(d.etat)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );

      default:
        return (
          <div className="welcome-card">
            <h2>Bienvenue, {user.nom} {user.prenom}</h2>
            <p>Bienvenue dans votre espace candidat.</p>
            <p>Vous pouvez consulter les offres disponibles et suivre vos candidatures.</p>
            <button onClick={() => setActiveTab('offres')}>Voir les offres</button>
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