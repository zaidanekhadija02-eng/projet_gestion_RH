 import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from 'react-modal';
import axios from 'axios';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import './EmployeDashboard.css';

function EmployeDashboard() {
  const [activeTab, setActiveTab] = useState('accueil');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  
  // ✅ CORRECTION : Utiliser id_personne au lieu de id_employe
  const idPersonne = user?.id_personne;
  const [idEmploye, setIdEmploye] = useState(null);

  // --- Demandes de congé ---
  const [demandes, setDemandes] = useState([]);
  const [modalCongeOpen, setModalCongeOpen] = useState(false);
  const [newConge, setNewConge] = useState({
    date_debut: '',
    date_fin: '',
    type_conge: '',
    certificat: null
  });

  // ✅ Récupérer l'id_employe depuis l'API au chargement
  useEffect(() => {
    const fetchEmployeId = async () => {
      if (!idPersonne) return;
      
      try {
        const res = await axios.get('http://localhost:8000/api/employes');
        const employe = res.data.find(e => e.personne.id_personne === idPersonne);
        
        if (employe) {
          setIdEmploye(employe.id_employe);
          console.log('✅ id_employe trouvé:', employe.id_employe);
        } else {
          console.error('❌ Employé introuvable pour id_personne:', idPersonne);
        }
      } catch (err) {
        console.error('Erreur récupération id_employe:', err);
      }
    };
    
    fetchEmployeId();
  }, [idPersonne]);

  // ✅ Récupérer les demandes de congé quand on a l'id_employe
  useEffect(() => {
    if (idEmploye) {
      fetchDemandes();
    }
  }, [idEmploye]);

  const fetchDemandes = async () => {
    if (!idPersonne) {
      console.error('❌ id_personne manquant');
      return;
    }
    
    try {
      // ✅ Utiliser id_personne pour récupérer les congés
      const res = await axios.get(`http://localhost:8000/api/conges/employe/${idPersonne}`);
      console.log('✅ Demandes récupérées:', res.data);
      setDemandes(res.data);
    } catch (err) {
      console.error("❌ Erreur récupération demandes:", err.response?.data || err.message);
    }
  };

  const handleCongeChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'certificat') {
      setNewConge(prev => ({ ...prev, certificat: files[0] }));
    } else {
      setNewConge(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDemanderConge = async () => {
    if (!newConge.date_debut || !newConge.date_fin || !newConge.type_conge) {
      return alert("Veuillez remplir tous les champs obligatoires !");
    }

    // Vérifier le certificat médical pour congé médical
    if (newConge.type_conge === 'conge_medical' && !newConge.certificat) {
      return alert("Le certificat médical est obligatoire pour un congé médical !");
    }

    if (!idEmploye) {
      return alert("Erreur : ID employé introuvable. Veuillez vous reconnecter.");
    }

    try {
      const formData = new FormData();
      formData.append('id_employe', idEmploye);
      formData.append('date_debut', newConge.date_debut);
      formData.append('date_fin', newConge.date_fin);
      formData.append('type_conge', newConge.type_conge);
      
      if (newConge.certificat) {
        formData.append('certificat', newConge.certificat);
      }

      console.log('📤 Envoi demande avec id_employe:', idEmploye);

      await axios.post('http://localhost:8000/api/conges', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert("Demande de congé envoyée avec succès !");
      setModalCongeOpen(false);
      setNewConge({
        date_debut: '',
        date_fin: '',
        type_conge: '',
        certificat: null
      });
      fetchDemandes();
    } catch (err) {
      console.error("Erreur demande congé:", err);
      alert("Erreur lors de l'envoi de la demande : " + (err.response?.data?.message || err.message));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getStatusBadge = (etat) => {
    if (etat === 1) {
      return <span className="badge badge-accepted">✔️ Accepté</span>;
    } else if (etat === 2) {
      return <span className="badge badge-rejected">❌ Refusé</span>;
    } else {
      return <span className="badge badge-pending">⏳ En attente</span>;
    }
  };

  const getTypeCongeLabel = (type) => {
    const types = {
      'conge_annuel': 'Congé Annuel',
      'conge_medical': 'Congé Médical',
      'conge_maternite': 'Congé Maternité',
      'conge_paternite': 'Congé Paternité',
      'conge_sans_solde': 'Congé Sans Solde'
    };
    return types[type] || type;
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'demander-conge':
        return (
          <div className="conge-container">
            <h2>Demander un Congé</h2>
            <div className="conge-form-card">
              <form onSubmit={(e) => { e.preventDefault(); setModalCongeOpen(true); }}>
                <div className="form-group">
                  <label>Date de début *</label>
                  <input 
                    type="date" 
                    name="date_debut" 
                    value={newConge.date_debut} 
                    onChange={handleCongeChange}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>Date de fin *</label>
                  <input 
                    type="date" 
                    name="date_fin" 
                    value={newConge.date_fin} 
                    onChange={handleCongeChange}
                    min={newConge.date_debut}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>Type de congé *</label>
                  <select 
                    name="type_conge" 
                    value={newConge.type_conge} 
                    onChange={handleCongeChange}
                    required
                  >
                    <option value="">-- Sélectionner --</option>
                    <option value="conge_annuel">Congé Annuel</option>
                    <option value="conge_medical">Congé Médical</option>
                    <option value="conge_maternite">Congé Maternité</option>
                    <option value="conge_paternite">Congé Paternité</option>
                    <option value="conge_sans_solde">Congé Sans Solde</option>
                  </select>
                </div>

                {newConge.type_conge === 'conge_medical' && (
                  <div className="form-group">
                    <label>Certificat médical * (PDF)</label>
                    <input 
                      type="file" 
                      name="certificat" 
                      accept="application/pdf"
                      onChange={handleCongeChange}
                      required
                    />
                  </div>
                )}

                <button type="submit" className="btn-submit-conge">
                  📤 Envoyer la demande
                </button>
              </form>
            </div>

            <Modal 
              isOpen={modalCongeOpen} 
              onRequestClose={() => setModalCongeOpen(false)}
              className="modal enhanced-modal"
              overlayClassName="overlay"
            >
              <h2>Confirmer la demande</h2>
              <button className="close-btn" onClick={() => setModalCongeOpen(false)}>×</button>
              
              <div className="confirmation-content">
                <p><strong>Date de début :</strong> {newConge.date_debut}</p>
                <p><strong>Date de fin :</strong> {newConge.date_fin}</p>
                <p><strong>Type :</strong> {getTypeCongeLabel(newConge.type_conge)}</p>
                {newConge.certificat && (
                  <p><strong>Certificat :</strong> {newConge.certificat.name}</p>
                )}
              </div>

              <div className="form-actions">
                <button className="btn-save" onClick={handleDemanderConge}>
                  ✅ Confirmer
                </button>
                <button className="btn-cancel" onClick={() => setModalCongeOpen(false)}>
                  ❌ Annuler
                </button>
              </div>
            </Modal>
          </div>
        );

      case 'mes-demandes':
        return (
          <div className="demandes-container">
            <h2>Mes Demandes de Congé</h2>
            {demandes.length === 0 ? (
              <p className="no-data">Vous n'avez pas encore fait de demande de congé.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Date de début</th>
                    <th>Date de fin</th>
                    <th>Type de congé</th>
                    <th>Date demande</th>
                    <th>Certificat</th>
                    <th>Statut</th>
                    <th>Justification</th>
                  </tr>
                </thead>
                <tbody>
                  {demandes.map((d, index) => (
                    <tr key={index}>
                      <td>{d.date_debut}</td>
                      <td>{d.date_fin}</td>
                      <td>{getTypeCongeLabel(d.type_conge)}</td>
                      <td>{d.date_demande || '—'}</td>
                      <td>
                        {d.certificat_medical ? (
                          <a 
                            href={`http://localhost:8000/storage/uploads/${d.certificat_medical}`} 
                            target="_blank" 
                            rel="noreferrer"
                          >
                            📄 Voir
                          </a>
                        ) : '—'}
                      </td>
                      <td>{getStatusBadge(d.etat)}</td>
                      <td>{d.justif || '—'}</td>
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
            <h2>Bienvenue, {user?.nom} {user?.prenom}</h2>
            <p>Bienvenue dans votre espace employé.</p>
            <p>Vous pouvez demander des congés et consulter vos demandes.</p>
            <button onClick={() => setActiveTab('demander-conge')}>
              Demander un congé
            </button>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-page">
      <nav className="dashboard-nav">
        <div className="nav-logo">TeamLP</div>
        <ul className="nav-links">
          <li 
            onClick={() => setActiveTab('accueil')} 
            className={activeTab === 'accueil' ? 'active' : ''}
          >
            Accueil
          </li>
          <li 
            onClick={() => setActiveTab('demander-conge')} 
            className={activeTab === 'demander-conge' ? 'active' : ''}
          >
            Demander un Congé
          </li>
          <li 
            onClick={() => setActiveTab('mes-demandes')} 
            className={activeTab === 'mes-demandes' ? 'active' : ''}
          >
            Mes Demandes
          </li>
        </ul>
        <button className="logout-icon" onClick={handleLogout}>
          <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
      </nav>
      <main className="dashboard-content">{renderContent()}</main>
    </div>
  );
}

export default EmployeDashboard;