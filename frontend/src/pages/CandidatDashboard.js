import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from 'react-modal';
import axios from 'axios';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import './CandidatDashboard.css';

Modal.setAppElement('#root');


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
{infos && (
  <div className="infos-card">
    <h3>Mes Informations Personnelles</h3>
    <div className="infos-row"><strong>CIN:</strong> <span>{infos.cin}</span></div>
    <div className="infos-row"><strong>Nom:</strong> <span>{infos.nom}</span></div>
    <div className="infos-row"><strong>Prénom:</strong> <span>{infos.prenom}</span></div>
    <div className="infos-row"><strong>Email:</strong> <span>{infos.email}</span></div>
    {infos.cv && <div className="infos-row"><a href={`http://localhost:8000/uploads/${infos.cv}`} target="_blank" rel="noreferrer">Télécharger CV</a></div>}
    {infos.motivation && <div className="infos-row"><a href={`http://localhost:8000/uploads/${infos.motivation}`} target="_blank" rel="noreferrer">Télécharger Lettre de Motivation</a></div>}
    <button className="edit-btn" onClick={() => { setUpdatedInfos(infos); setModalEditOpen(true); }}> Modifier mes infos</button>
  </div>
)}


<Modal 
              isOpen={modalEditOpen} 
              onRequestClose={() => setModalEditOpen(false)} 
              className="edit-modal"
              overlayClassName="edit-overlay"
            >
              <h2 className="edit-title">Modifier mes informations</h2>

              <form 
                className="edit-form"
                onSubmit={async e => {
                  e.preventDefault();
                  if (!idCandidat) return;
                  try {
                    const formData = new FormData();
                    Object.keys(updatedInfos).forEach(key => {
                      if (key !== 'cvFile' && key !== 'motivationFile') formData.append(key, updatedInfos[key]);
                    });
                    if (updatedInfos.cvFile) formData.append('cv', updatedInfos.cvFile);
                    if (updatedInfos.motivationFile) formData.append('motivation', updatedInfos.motivationFile);

                    await axios.put(
                      `http://localhost:8000/api/candidats/${idCandidat}`,
                      formData,
                      { headers: { 'Content-Type': 'multipart/form-data' } }
                    );

                    alert("Informations mises à jour !");
                    setModalEditOpen(false);
                    setInfos({ ...infos, ...updatedInfos });
                  } catch (err) {
                    console.error(err);
                    alert("Erreur lors de la mise à jour !");
                  }
                }}
              >
                <div className="input-group">
                  <label className="input-title">Nom</label>
                  <input type="text" name="nom" value={updatedInfos.nom || ''} onChange={handleEditChange} required/>
                </div>

                <div className="input-group">
                  <label className="input-title">Prénom</label>
                  <input type="text" name="prenom" value={updatedInfos.prenom || ''} onChange={handleEditChange} required/>
                </div>

                <div className="input-group">
                  <label className="input-title">Email</label>
                  <input type="email" name="email" value={updatedInfos.email || ''} onChange={handleEditChange} required/>
                </div>

                <div className="input-group">
                  <label className="input-title">CV</label>
                  <input type="file" name="cvFile" accept=".pdf,.doc,.docx" onChange={e => setUpdatedInfos(prev => ({ ...prev, cvFile: e.target.files[0] }))}/>
                  {infos.cv && <a href={`http://localhost:8000/uploads/${infos.cv}`} target="_blank" rel="noreferrer">CV actuel</a>}
                </div>

                <div className="input-group">
                  <label className="input-title">Lettre de motivation</label>
                  <input type="file" name="motivationFile" accept=".pdf,.doc,.docx" onChange={e => setUpdatedInfos(prev => ({ ...prev, motivationFile: e.target.files[0] }))}/>
                  {infos.motivation && <a href={`http://localhost:8000/uploads/${infos.motivation}`} target="_blank" rel="noreferrer">Lettre actuelle</a>}
                </div>

                <div className="edit-actions">
                  <button type="submit" className="save-btn">Sauvegarder</button>
                  <button type="button" className="cancel-btn" onClick={() => setModalEditOpen(false)}>Annuler</button>
                </div>
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
                      {d.etat === 'Accepté' ? '✔' : (d.etat === 'Refusé' ? '❌' : '⏳')}
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

      <main className="dashboard-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default CandidatDashboard;
