 import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import './ListeConges.css';

function ListeCongesEmploye() {
  const { id_personne } = useParams();
  const navigate = useNavigate();
  const [conges, setConges] = useState([]);
  const [employeInfo, setEmployeInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedConge, setSelectedConge] = useState(null);
  const [newStatus, setNewStatus] = useState(0);
  const [justification, setJustification] = useState('');

  useEffect(() => {
    fetchConges();
  }, [id_personne]);

  const fetchConges = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:8000/api/conges/employe/${id_personne}`);
      setConges(res.data);

      // Récupérer les infos de l'employé depuis le premier congé
      if (res.data.length > 0 && res.data[0].employe) {
        const employe = res.data[0].employe;
        setEmployeInfo({
          nom: employe.personne?.nom || '',
          prenom: employe.personne?.prenom || '',
          cin: employe.personne?.cin || ''
        });
      } else {
        // Si pas de congés, récupérer les infos depuis l'API employés
        const empRes = await axios.get(`http://localhost:8000/api/employes`);
        const employe = empRes.data.find(e => e.personne.id_personne === parseInt(id_personne));
        if (employe) {
          setEmployeInfo({
            nom: employe.personne.nom,
            prenom: employe.personne.prenom,
            cin: employe.personne.cin
          });
        }
      }
    } catch (err) {
      console.error("Erreur récupération congés:", err);
      alert("Erreur lors de la récupération des congés");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (conge) => {
    setSelectedConge(conge);
    setNewStatus(conge.etat);
    setJustification(conge.justif || '');
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedConge(null);
    setNewStatus(0);
    setJustification('');
  };

  const handleUpdateStatus = async () => {
    if (!selectedConge) return;

    try {
      await axios.put(
        `http://localhost:8000/api/conges/${selectedConge.id_conge}/status`,
        { 
          etat: newStatus,
          justif: justification
        }
      );

      alert(`Demande ${newStatus === 1 ? 'acceptée' : newStatus === 2 ? 'refusée' : 'mise à jour'} avec succès !`);
      handleCloseModal();
      fetchConges();
    } catch (err) {
      console.error("Erreur mise à jour statut:", err);
      alert("Erreur lors de la mise à jour du statut");
    }
  };

  const getTypeLabel = (type) => {
    const types = {
      'conge_annuel': 'Congé Annuel',
      'conge_medical': 'Congé Médical',
      'conge_maternite': 'Congé Maternité',
      'conge_paternite': 'Congé Paternité',
      'conge_sans_solde': 'Congé Sans Solde'
    };
    return types[type] || type;
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="conges-page">
      <div className="conges-container">
        <div className="conges-header">
          <h2>
            📋 Demandes de congé de {employeInfo ? `${employeInfo.prenom} ${employeInfo.nom}` : ''}
          </h2>
         <button className="back-btn" onClick={() => navigate('/admin-dashboard?tab=liste-employes')}>
  ← Retour
</button>
        </div>

        <div className="table-wrapper">
          <table className="conges-table">
            <thead>
              <tr>
                <th>CIN</th>
                <th>Nom Complet</th>
                <th>Date Début</th>
                <th>Date Fin</th>
                <th>Type</th>
                <th>Date Demande</th>
                <th>Certificat</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {conges.length > 0 ? (
                conges.map((conge) => (
                  <tr key={conge.id_conge}>
                    <td>{employeInfo?.cin || '—'}</td>
                    <td>{employeInfo ? `${employeInfo.prenom} ${employeInfo.nom}` : '—'}</td>
                    <td>{conge.date_debut}</td>
                    <td>{conge.date_fin}</td>
                    <td>{getTypeLabel(conge.type_conge)}</td>
                    <td>{conge.date_demande || '—'}</td>
                    <td>
                      {conge.certificat_medical ? (
                        <a 
                          href={`http://localhost:8000/storage/uploads/${conge.certificat_medical}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="download-link"
                        >
                          📄 Télécharger
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      {conge.etat === 1 ? (
                        <span className="status-badge status-accepte">✔️ ACCEPTÉE</span>
                      ) : conge.etat === 2 ? (
                        <span className="status-badge status-refuse">❌ REFUSÉE</span>
                      ) : (
                        <div className="action-buttons">
                          <button
                            className="btn btn-success"
                            onClick={() => handleOpenModal(conge)}
                          >
                            <FontAwesomeIcon icon={faCheck} /> Gérer
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">
                    <div className="empty-message">
                      Aucune demande de congé trouvée pour cet employé.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal pour accepter/refuser */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={handleCloseModal}
        className="modal-conge"
        overlayClassName="modal-overlay"
        ariaHideApp={false}
      >
        <div className="modal-header">
          <h2>📋 Gérer la demande de congé</h2>
          <button className="modal-close-btn" onClick={handleCloseModal}>×</button>
        </div>

        {selectedConge && (
          <div className="modal-body">
            <div className="info-row">
              <strong>Employé :</strong> 
              <span>{employeInfo ? `${employeInfo.prenom} ${employeInfo.nom}` : '—'}</span>
            </div>
            <div className="info-row">
              <strong>Période :</strong> 
              <span>{selectedConge.date_debut} au {selectedConge.date_fin}</span>
            </div>
            <div className="info-row">
              <strong>Type :</strong> 
              <span>{getTypeLabel(selectedConge.type_conge)}</span>
            </div>

            <div className="form-group-modal">
              <label>Décision</label>
              <select 
                value={newStatus} 
                onChange={(e) => setNewStatus(Number(e.target.value))}
                className="form-select"
              >
                <option value={0}>⏳ En attente</option>
                <option value={1}>✅ Accepter</option>
                <option value={2}>❌ Refuser</option>
              </select>
            </div>

            <div className="form-group-modal">
              <label>Justification (optionnelle)</label>
              <textarea 
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                className="form-textarea"
                rows="4"
                placeholder="Ajouter une justification..."
              />
            </div>

            <div className="modal-actions">
              <button className="btn btn-success" onClick={handleUpdateStatus}>
                <FontAwesomeIcon icon={faCheck} /> Save
              </button>
              <button className="btn btn-danger" onClick={handleCloseModal}>
                <FontAwesomeIcon icon={faTimes} /> Annuler
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ListeCongesEmploye;