 import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import './ListeOffres.css';

function ListeOffres() {
  const { id_offre } = useParams();
  const navigate = useNavigate();
  const [candidatures, setCandidatures] = useState([]);
  const [offreInfo, setOffreInfo] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/offres/${id_offre}/candidatures`)
      .then((res) => {
        setOffreInfo(res.data.offre_info);
        setCandidatures(res.data.candidatures);
      })
      .catch((err) => console.error(err));
  }, [id_offre]);

  const handleStatus = (id_candidat, id_offre, status) => {
    axios
      .put(`http://localhost:8000/api/demandes/${id_candidat}/${id_offre}/status`, {
        accepted: status,
      })
      .then(() => {
        setCandidatures((prev) =>
          prev.map((item) =>
            item.id_candidat === id_candidat && item.id_offre === id_offre
              ? { ...item, accepted: status }
              : item
          )
        );
      });
  };

  return (
    <div className="candidatures-page">
      <div className="candidatures-container">
        <div className="candidatures-header">
          <h2>
            📋 Candidatures pour l'offre : {offreInfo?.departement} - {offreInfo?.profession}
          </h2>
          <button className="back-btn" onClick={() => navigate('/admin')}>
            ← Retour
          </button>
        </div>

        <div className="table-wrapper">
          <table className="candidatures-table">
            <thead>
              <tr>
                <th>CIN</th>
                <th>NOM</th>
                <th>PRÉNOM</th>
                <th>VILLE</th>
                <th>CV</th>
                <th>LETTRE</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {candidatures.length > 0 ? (
                candidatures.map((cand, index) => (
                  <tr key={index}>
                    <td>{cand.cin}</td>
                    <td>{cand.nom}</td>
                    <td>{cand.prenom}</td>
                    <td>{cand.ville}</td>

                    <td>
                      {cand.cv ? (
                        <a href={`http://localhost:8000/uploads/${cand.cv}`} target="_blank" rel="noreferrer">
                          📄 Télécharger CV
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>

                    <td>
                      {cand.lettre ? (
                        <a href={`http://localhost:8000/uploads/${cand.lettre}`} target="_blank" rel="noreferrer">
                          📄 Télécharger Lettre
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>

                    <td>
                      {cand.accepted === 1 ? (
                        <span className="status-badge status-accepte">✔️ ACCEPTÉE</span>
                      ) : cand.accepted === -1 || cand.accepted === 2 ? (
                        <span className="status-badge status-refuse">❌ REFUSÉE</span>
                      ) : (
                        <div className="action-buttons">
                          <button
                            className="btn btn-success"
                            onClick={() => handleStatus(cand.id_candidat, cand.id_offre, 1)}
                          >
                            ✓ ACCEPTER
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleStatus(cand.id_candidat, cand.id_offre, -1)}
                          >
                            ✗ REFUSER
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">
                    <div className="empty-message">
                      Aucune candidature trouvée pour cette offre.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ListeOffres;