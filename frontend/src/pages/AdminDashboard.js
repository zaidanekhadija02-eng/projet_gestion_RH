import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './AdminDashboard.css';
import Modal from 'react-modal';
import axios from "axios";
import { 
  faRightFromBracket,
  faEdit,
  faTrash,
  faCalendarCheck,
  faLock,
  faLockOpen
} from '@fortawesome/free-solid-svg-icons';


function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('accueil');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));



const [modalCandidatOpen, setModalCandidatOpen] = useState(false);
const [newCandidat, setNewCandidat] = useState({
  cin: '',
  nom: '',
  prenom: '',
  email: '',
  motdepasse: '',
  ville: '',
  cv: null,
  lettre: null
});

// 2️⃣ Fonctions pour ouvrir/fermer le modal
const openModalCandidat = () => {
  setNewCandidat({
    cin: '',
    nom: '',
    prenom: '',
    email: '',
    motdepasse: '',
    ville: '',
    cv: null,
    lettre: null
  });
  setModalCandidatOpen(true);
};

const closeModalCandidat = () => setModalCandidatOpen(false);

// 3️⃣ Fonction pour gérer les changements des inputs
const handleCandidatChange = (e) => {
  const { name, value, files } = e.target;

  if (name === "cv" || name === "lettre") {
    setNewCandidat(prev => ({ ...prev, [name]: files[0] }));
  } else {
    setNewCandidat(prev => ({ ...prev, [name]: value }));
  }
};

// 4️⃣ Fonction pour sauvegarder le candidat
const handleSaveCandidat = async () => {
  // ✅ Validate all required fields INCLUDING files
  if (!newCandidat.cin || !newCandidat.nom || !newCandidat.prenom || 
      !newCandidat.email || !newCandidat.motdepasse || 
      !newCandidat.cv || !newCandidat.lettre) {
    return alert("Tous les champs obligatoires doivent être remplis, y compris CV et lettre de motivation !");
  }

  const formData = new FormData();
  formData.append("cin", newCandidat.cin);
  formData.append("nom", newCandidat.nom);
  formData.append("prenom", newCandidat.prenom);
  formData.append("email", newCandidat.email);
  formData.append("motdepasse", newCandidat.motdepasse);
  formData.append("ville", newCandidat.ville || "");  // ✅ Handle empty ville
  formData.append("cv", newCandidat.cv);              // ✅ File object
  formData.append("lettre", newCandidat.lettre);      // ✅ File object

  try {
    await axios.post("http://localhost:8000/api/candidats", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    alert("Candidat ajouté !");
    setModalCandidatOpen(false);
    
    // ✅ Reset form
    setNewCandidat({
      cin: '',
      nom: '',
      prenom: '',
      email: '',
      motdepasse: '',
      ville: '',
      cv: null,
      lettre: null
    });
    
  } catch (err) {
    console.error("Erreur complète:", err.response?.data);
    alert("Erreur lors de l'ajout du candidat : " + 
          JSON.stringify(err.response?.data?.errors || err.response?.data?.message || err.message));
  }
};



const [offres, setOffres] = useState([]);
useEffect(() => {
  const fetchOffres = async () => {
    try {
const res = await axios.get('http://localhost:8000/api/offres');
setOffres(res.data);

    } catch (err) {
      console.error("Erreur récupération offres :", err);
      alert("Impossible de récupérer les offres.");
    }
  };
  fetchOffres();
}, []);


const [editingOffreId, setEditingOffreId] = useState(null);


// Lorsqu'on clique sur "Modifier"
const handleModifierOffre = (offre) => {
  setEditingOffreId(offre.id_offre);
  setNewOffre({
    id_depart: Number(offre.id_depart) || "", // forcer à number
    id_prof: Number(offre.id_prof) || "",
    date_pub: offre.date_pub || "",
    type_emploi: offre.type_emploi || "",
    detail: null // pas de PDF par défaut
  });
  setModalOffreOpen(true);
};

const handleBloquerOffre = async (offre) => {
  const nouveauStatus = offre.termine === 0 ? 1 : 0;
  try {
    await axios.put(`http://localhost:8000/api/offres/${offre.id_offre}/bloquer`);
    setOffres(prev => prev.map(o => o.id_offre === offre.id_offre ? { ...o, termine: nouveauStatus } : o));
    alert(`Offre ${nouveauStatus === 1 ? 'bloquée' : 'débloquée'} !`);
  } catch (err) {
    console.error("Erreur blocage/déblocage :", err.response?.data || err.message);
    alert("Erreur lors du blocage/déblocage de l'offre !");
  }
};



const handleSupprimerOffre = async (id) => {
  if (!window.confirm("Voulez-vous vraiment supprimer cette offre ?")) return;
  try {
    await axios.delete(`http://localhost:8000/api/offres/${id}`);
    setOffres(prev => prev.filter(o => o.id_offre !== id));

    alert("Offre supprimée !");
  } catch (err) {
  console.error("Erreur API suppression offre :", err.response?.data || err.message);
  alert("Erreur suppression de l'offre : " + (err.response?.data?.message || err.message));
}

};



const handleVoirCandidats = (id) => {
  navigate(`/offres/${id}/candidatures`); // ✅ Naviguer vers la page des candidatures
};


const [modalOffreOpen, setModalOffreOpen] = useState(false);
const [newOffre, setNewOffre] = useState({
  id_depart: '',
  id_prof: '',
  date_pub: '',
  type_emploi: '',
  detail: null
});


const openModalOffre = () => {
  setNewOffre({
    id_depart: '',    // ou departements[0]?.id_depart si tu veux une valeur par défaut
    id_prof: '',      // ou professions[0]?.id_prof
    date_pub: '',
    type_emploi: '',
    detail: null
  });
  setEditingOffreId(null); // nouvelle offre
  setModalOffreOpen(true);
};

const closeModalOffre = () => setModalOffreOpen(false);

const handleOffreChange = (e) => {
  const { name, value, files } = e.target;

  if (name === "detail") {
    setNewOffre(prev => ({ ...prev, detail: files[0] }));
  } else if (name === "id_depart" || name === "id_prof") {
    setNewOffre(prev => ({ ...prev, [name]: value ? Number(value) : '' })); // convert to number
  } else {
    setNewOffre(prev => ({ ...prev, [name]: value }));
  }
};


const handleSaveOffre = async () => {
  if (!newOffre.id_depart || !newOffre.id_prof || !newOffre.date_pub || !newOffre.type_emploi) {
    return alert("Tous les champs sont requis !");
  }

  const formData = new FormData();
  formData.append("id_depart", newOffre.id_depart);
  formData.append("id_prof", newOffre.id_prof);
  formData.append("date_pub", newOffre.date_pub);
  formData.append("type_emploi", newOffre.type_emploi);

  if (newOffre.detail) {
    formData.append("detail", newOffre.detail);
  }

  try {
    if (editingOffreId) {
      await axios.post(`http://localhost:8000/api/offres/${editingOffreId}?_method=PUT`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
    } else {
      await axios.post("http://localhost:8000/api/offres", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
    }

    alert("Offre sauvegardée !");
    setModalOffreOpen(false);
    setEditingOffreId(null);

    const res = await axios.get("http://localhost:8000/api/offres");
    setOffres(res.data);

  } catch (err) {
    console.error("Erreur sauvegarde offre :", err.response?.data || err.message);
    alert("Erreur sauvegarde offre : " + JSON.stringify(err.response?.data || err.message));
  }
};




  
const [modalDepOpen, setModalDepOpen] = useState(false);
const [newDepartement, setNewDepartement] = useState('');
const openModalDep = () => setModalDepOpen(true);
const closeModalDep = () => setModalDepOpen(false);

const handleSaveDepartement = async () => {
  if (!newDepartement.trim()) return alert("Le nom du département est requis !");

  try {
    const res = await axios.post('http://localhost:8000/api/departements', { nom_depart: newDepartement });
    setDepartements(prev => [...prev, res.data]);
    setNewDepartement('');
    setModalDepOpen(false);
    alert("Département ajouté !");
  } catch (err) {
    console.error(err);
    alert("Erreur lors de l'ajout du département");
  }
};
const [modalProfOpen, setModalProfOpen] = useState(false);
const [newProfession, setNewProfession] = useState('');

const openModalProf = () => setModalProfOpen(true);
const closeModalProf = () => setModalProfOpen(false);

const handleSaveProfession = async () => {
  if (!newProfession.trim()) return alert("Le nom de la profession est requis !");

  try {
    const res = await axios.post('http://localhost:8000/api/professions', { nom_prof: newProfession });
;
    setProfessions(prev => [...prev, res.data]);
    setNewProfession('');
    setModalProfOpen(false);
    alert("Profession ajoutée !");
  } catch (err) { // ✅ utiliser catch { ... }
  console.error("Erreur API :", err.response?.data || err.message);
  alert("Erreur lors de l'ajout de la profession : " + (err.response?.data?.message || err.message));
  }
};









// Ajouter ces fonctions dans ton composant AdminDashboard

const handleModifierDepartement = (dep) => {
  const nouveauNom = prompt("Nouveau nom du département :", dep.nom_depart);
  if (!nouveauNom) return;

axios.put(`http://localhost:8000/api/departements/${dep.id_depart}`, { nom_depart: nouveauNom })

    .then(res => {
      setDepartements(prev => prev.map(d => d.id_depart === dep.id_depart ? { ...d, nom_depart: nouveauNom } : d));
      alert("Département modifié !");
    })
.catch(err => {
  console.error("Erreur API :", err.response?.data || err.message);
  alert("Erreur lors de la modification du département : " + (err.response?.data?.message || err.message));
});

};

const handleSupprimerDepartement = (dep) => {
  if (!window.confirm(`Voulez-vous vraiment supprimer le département ${dep.nom_depart} ?`)) return;

  axios.delete(`http://localhost:8000/api/departements/${dep.id_depart}`)
    .then(res => {
      setDepartements(prev => prev.filter(d => d.id_depart !== dep.id_depart));
      alert("Département supprimé !");
    })
    .catch(err => {
      console.error(err);
      alert("Erreur lors de la suppression du département");
    });
};






  const [employes, setEmployes] = useState([]);

  useEffect(() => {
    const fetchEmployes = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/employes");
        const data = response.data.map(emp => ({
          cin: emp.personne.cin,
          nom: emp.personne.nom,
          prenom: emp.personne.prenom,
          email: emp.personne.email,
          ville: emp.personne.adresse?.ville || '',
          profession: emp.profession?.nom_prof || '',
          departement: emp.departement?.nom_depart || '',
          id_personne: emp.personne.id_personne,

          // CHAMPS QUI MANQUAIENT
          id_depart: emp.id_depart,
          id_prof: emp.id_prof,
          num_bureau: emp.num_bureau,
        }));
        setEmployes(data);
      } catch (error) {
        console.error("Erreur récupération employés :", error);
        alert("Impossible de récupérer les employés depuis le serveur.");
      }
    };
    fetchEmployes();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const [modalOpen, setModalOpen] = useState(false);

  const handleAjouterClick = () => {
    setEditingId(null);
    setNewEmploye({
      cin: '',
      nom: '',
      prenom: '',
      email: '',
      motdepasse: '',
      ville: '',
      id_depart: '',
      id_prof: '',
      num_bureau: ''
    });
    setModalOpen(true);
  };

  const [editingId, setEditingId] = useState(null);

  const handleModifier = (emp) => {
    setEditingId(emp.id_personne);

    setNewEmploye({
      cin: emp.cin,
      nom: emp.nom,
      prenom: emp.prenom,
      email: emp.email,
      motdepasse: "",
      ville: emp.ville,
      id_depart: emp.id_depart,
      id_prof: emp.id_prof,
      num_bureau: emp.num_bureau
    });

    setModalOpen(true);
  };

  const handleSupprimer = async (id_personne) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet employé ?")) return;

    try {
      await axios.delete(`http://localhost:8000/api/employes/${id_personne}`);

      setEmployes(employes.filter(emp => emp.id_personne !== id_personne));
      alert("Employé supprimé !");
    } catch (error) {
      console.error("Erreur suppression :", error);
      alert("Erreur lors de la suppression.");
    }
  };

  const handleVoirConges = (id_personne) => {
  navigate(`/employes/${id_personne}/conges`); // ✅ Naviguer vers la page des congés
};

  const handleCloseModal = () => setModalOpen(false);

  const [newEmploye, setNewEmploye] = useState({
    cin: '',
    nom: '',
    prenom: '',
    email: '',
    motdepasse: '',
    ville: '',
    id_depart: '',
    id_prof: '',
    num_bureau: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmploye(prev => ({ ...prev, [name]: value }));
  };

const handleSaveEmploye = async () => {
  try {
    // Récupérer l'objet profession correspondant au nom choisi
    const selectedProf = professions.find(p => p.nom_prof === newEmploye.id_prof);
    const idProf = selectedProf ? selectedProf.id_prof : null;

    const payload = {
      cin: newEmploye.cin,
      nom: newEmploye.nom,
      prenom: newEmploye.prenom,
      email: newEmploye.email,
      motdepasse: newEmploye.motdepasse || undefined,
      ville: newEmploye.ville,
      id_depart: newEmploye.id_depart,
      id_prof: idProf, // <-- ici on met l'id correspondant au nom choisi
      num_bureau: newEmploye.num_bureau
    };

    if (!editingId) {
      await axios.post("http://localhost:8000/api/employes", payload);
    } else {
      await axios.put(`http://localhost:8000/api/employes/${editingId}`, payload);
    }

    alert("Employé sauvegardé !");
    setModalOpen(false);
    setEditingId(null);

    const res = await axios.get("http://localhost:8000/api/employes");
    const data = res.data.map(emp => ({
      cin: emp.personne.cin,
      nom: emp.personne.nom,
      prenom: emp.personne.prenom,
      email: emp.personne.email,
      ville: emp.personne.adresse?.ville || '',
      profession: emp.profession?.nom_prof || '',
      departement: emp.departement?.nom_depart || '',
      id_depart: emp.id_depart,
      id_prof: emp.id_prof,
      num_bureau: emp.num_bureau,
      id_personne: emp.personne.id_personne,
    }));
    setEmployes(data);

  } catch (error) {
    console.error("Erreur :", error);
    alert("ERREUR API : " + JSON.stringify(error.response?.data || error.message));
  }
};


const [departements, setDepartements] = useState([]);
const [professions, setProfessions] = useState([]);

useEffect(() => {
  const fetchData = async () => {
    try {
      const depRes = await axios.get("http://localhost:8000/api/departements");
      setDepartements(depRes.data);

      const profRes = await axios.get("http://localhost:8000/api/professions");
      setProfessions(profRes.data);
    } catch (err) {
      console.error(err);
    }
  };
  fetchData();
}, []);


  const renderContent = () => {
    switch(activeTab) {
      case 'liste-employes':
        return (
          <div className="employes-container">
            <div className="employes-header">
              <h2>Liste des Employés</h2>
              <button className="add-btn" onClick={handleAjouterClick}>+ Ajouter employé</button>
            </div>

            <table className="employes-table">
              <thead>
                <tr>
                  <th>CIN</th>
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th>Email</th>
                  <th>Ville</th>
                  <th>Profession</th>
                  <th>Département</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {employes.map(emp => (
                  <tr key={emp.cin}>
                    <td>{emp.cin}</td>
                    <td>{emp.nom}</td>
                    <td>{emp.prenom}</td>
                    <td>{emp.email}</td>
                    <td>{emp.ville}</td>
                    <td>{emp.profession}</td>
                    <td>{emp.departement}</td>

                    <td className="actions">

                      <button className="icon-btn" onClick={() => handleModifier(emp)}>
                        <FontAwesomeIcon icon={faEdit} title="Modifier" />
                      </button>

                      <button className="icon-btn" onClick={() => handleSupprimer(emp.id_personne)}>
                        <FontAwesomeIcon icon={faTrash} title="Supprimer" />
                      </button>

                      <button className="icon-btn" onClick={() => handleVoirConges(emp.id_personne)}>
  <FontAwesomeIcon icon={faCalendarCheck} title="Congés" />
</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Modal
              isOpen={modalOpen}
              onRequestClose={handleCloseModal}
              contentLabel="Ajouter Employé"
              className="modal enhanced-modal"
              overlayClassName="overlay"
            >
              <h2 className="modal-title">➕ Ajouter un Employé</h2>

              <button className="close-btn" onClick={handleCloseModal}>×</button>

              <form 
                className="employe-form enhanced-form"
                onSubmit={e => { e.preventDefault(); handleSaveEmploye(); }}
              >

                <div className="form-grid">
                  
                  <div className="form-group">
                    <label>CIN</label>
                    <input type="text" name="cin" value={newEmploye.cin} onChange={handleInputChange} required />
                  </div>

                  <div className="form-group">
                    <label>Nom</label>
                    <input type="text" name="nom" value={newEmploye.nom} onChange={handleInputChange} required />
                  </div>

                  <div className="form-group">
                    <label>Prénom</label>
                    <input type="text" name="prenom" value={newEmploye.prenom} onChange={handleInputChange} required />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value={newEmploye.email} onChange={handleInputChange} required />
                  </div>

                  <div className="form-group">
                    <label>Mot de passe</label>
                    <input type="password" name="motdepasse" value={newEmploye.motdepasse} onChange={handleInputChange} required />
                  </div>

                  <div className="form-group">
                    <label>Ville</label>
                    <input type="text" name="ville" value={newEmploye.ville} onChange={handleInputChange} required />
                  </div>

<div className="form-group">
  <label>Département</label>
<select name="id_depart" value={newEmploye.id_depart}
onChange={handleInputChange}>
  <option value="">-- Sélectionner --</option>
  {departements.map(dep => (
    <option key={dep.id_depart} value={dep.id_depart}>{dep.nom_depart}</option>
  ))}
</select>

</div>


<div className="form-group">
  <label>Profession</label>
  <select 
    name="id_prof" 
    value={newEmploye.id_prof} 
    onChange={handleInputChange} 
    required
  >
    <option value="">-- Sélectionner --</option>
    {professions.map(prof => (
      <option key={prof.id_prof} value={prof.nom_prof}>
        {prof.nom_prof}
      </option>
    ))}
  </select>
</div>

                  <div className="form-group">
                    <label>N° Bureau</label>
                    <input type="text" name="num_bureau" value={newEmploye.num_bureau} onChange={handleInputChange} required />
                  </div>

                </div>

                <button type="submit" className="save-btn enhanced-save-btn">
                  💾 Sauvegarder l’employé
                </button>

              </form>
            </Modal>
          </div>
        );

        
        case 'liste-postes':
  return (
    <div className="employes-container">
<div className="employes-header">
  <h2>Les postes :</h2>
<div className="btn-group">
  <button className="add-btn" onClick={openModalDep}>+ Ajouter Département</button>
  <button className="add-btn" onClick={openModalProf}>+ Ajouter Profession</button>
</div>

</div>


      <table className="employes-table">
        <thead>
          <tr>
            <th>Département</th>
            <th>Profession</th>
            <th>Nombre des employés</th>
            <th>Actions</th>
          </tr>
        </thead>
<Modal isOpen={modalDepOpen} onRequestClose={closeModalDep} className="modal enhanced-modal" overlayClassName="overlay">
  <h2>➕ Ajouter Département</h2>
  <button className="close-btn" onClick={closeModalDep}>×</button>
  <div className="form-group">
    <label>Nom Département</label>
    <input type="text" value={newDepartement} onChange={e => setNewDepartement(e.target.value)} />
  </div>
  <button className="save-btn" onClick={handleSaveDepartement}>💾 Sauvegarder</button>
</Modal>

<Modal isOpen={modalProfOpen} onRequestClose={closeModalProf} className="modal enhanced-modal" overlayClassName="overlay">
  <h2>➕ Ajouter Profession</h2>
  <button className="close-btn" onClick={closeModalProf}>×</button>
  <div className="form-group">
    <label>Nom Profession</label>
    <input type="text" value={newProfession} onChange={e => setNewProfession(e.target.value)} />
  </div>
  <button className="save-btn" onClick={handleSaveProfession}>💾 Sauvegarder</button>
</Modal>
<tbody>
  {departements.map(dep => {
    // 1️⃣ Filtrer les employés de ce département
    const empDuDep = employes.filter(emp => emp.id_depart === dep.id_depart);

    // 2️⃣ Extraire uniquement les professions distinctes présentes dans ce département
    const profsDuDep = empDuDep
      .map(emp => {
        const prof = professions.find(p => p.id_prof === emp.id_prof);
        return prof ? prof.nom_prof : null;
      })
      .filter(Boolean); // supprime les valeurs null
    const profsUniques = [...new Set(profsDuDep)]; // enlever les doublons


    return (
      <tr key={dep.id_depart}>
        <td>{dep.nom_depart}</td>
        <td>{profsUniques.length > 0 ? profsUniques.join(', ') : '—'}</td>
        <td>{empDuDep.length}</td>
<td className="actions">
  <button className="icon-btn" onClick={() => handleModifierDepartement(dep)}>
    <FontAwesomeIcon icon={faEdit} title="Modifier" />
  </button>
  <button className="icon-btn" onClick={() => handleSupprimerDepartement(dep)}>
    <FontAwesomeIcon icon={faTrash} title="Supprimer" />
  </button>
</td>

      </tr>
    );
  })}
</tbody>


      </table>
    </div>
  );



case 'offres-emploi':
  return (
    <div className="employes-container">
      <div className="employes-header">
        <h2>Les Offres d'Emploi</h2>
<div className="btn-group">
  <button className="add-btn" onClick={openModalOffre}>
    + Ajouter Offre
  </button>
  <button className="add-btn" onClick={openModalCandidat}>
    + Ajouter Candidat
  </button>
</div>

      </div>

      <table className="employes-table">
        <thead>
          <tr>
            <th>Département</th>
            <th>Profession</th>
            <th>Date de Publication</th>
            <th>Type d'emploi</th>
            <th>Détail</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {offres.map(offre => (
 <tr key={offre.id_offre}>
  <td>{offre.departement}</td>
  <td>{offre.profession}</td>
  <td>{offre.date_publication}</td>
  <td>{offre.type}</td>
  <td>
    {offre.detail ? (
      <a href={`http://localhost:8000/uploads/${offre.detail}`} target="_blank" rel="noopener noreferrer">
        Télécharger PDF
      </a>
    ) : "—"}
  </td>
  <td className="actions">
    <button className="icon-btn" onClick={() => handleModifierOffre(offre)}>
      <FontAwesomeIcon icon={faEdit} title="Modifier" />
    </button>
    <button className="icon-btn" onClick={() => handleSupprimerOffre(offre.id_offre)}>
      <FontAwesomeIcon icon={faTrash} title="Supprimer" />
    </button>
    <button className="icon-btn" onClick={() => handleVoirCandidats(offre.id_offre)}>
      <FontAwesomeIcon icon={faCalendarCheck} title="Voir candidatures" />
    </button>
                <button className="icon-btn" onClick={() => handleBloquerOffre(offre)}>
                  <FontAwesomeIcon 
                    icon={offre.termine === 1 ? faLockOpen : faLock} 
                    title={offre.termine === 1 ? "Débloquer" : "Bloquer"} 
                  />
                </button>

  </td>
</tr>

          ))}
        </tbody>
      </table>
<Modal
  isOpen={modalCandidatOpen}
  onRequestClose={closeModalCandidat}
  className="modal enhanced-modal"
  overlayClassName="overlay"
>
  <h2>➕ Ajouter un Candidat</h2>
  <button className="close-btn" onClick={closeModalCandidat}>×</button>

  <form onSubmit={e => { e.preventDefault(); handleSaveCandidat(); }} className="employe-form enhanced-form">
    <div className="form-grid">
      <div className="form-group">
        <label>CIN</label>
        <input type="text" name="cin" value={newCandidat.cin} onChange={handleCandidatChange} required />
      </div>
      <div className="form-group">
        <label>Nom</label>
        <input type="text" name="nom" value={newCandidat.nom} onChange={handleCandidatChange} required />
      </div>
      <div className="form-group">
        <label>Prénom</label>
        <input type="text" name="prenom" value={newCandidat.prenom} onChange={handleCandidatChange} required />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input type="email" name="email" value={newCandidat.email} onChange={handleCandidatChange} required />
      </div>
      <div className="form-group">
        <label>Mot de passe</label>
        <input type="password" name="motdepasse" value={newCandidat.motdepasse} onChange={handleCandidatChange} required />
      </div>
      <div className="form-group">
        <label>Ville</label>
        <input type="text" name="ville" value={newCandidat.ville} onChange={handleCandidatChange} />
      </div>
      <div className="form-group">
  <label>Ajouter CV *</label>
  <input type="file" name="cv" accept="application/pdf" onChange={handleCandidatChange} required />
</div>
<div className="form-group">
  <label>Ajouter lettre de motivation *</label>
  <input type="file" name="lettre" accept="application/pdf" onChange={handleCandidatChange} required />
</div>
    </div>

    <button type="submit" className="save-btn enhanced-save-btn">
      💾 Sauvegarder le candidat
    </button>
  </form>
</Modal>
<Modal
  isOpen={modalOffreOpen}
  onRequestClose={closeModalOffre}
  className="modal enhanced-modal"
  overlayClassName="overlay"
>
<h2>➕ Ajouter Offre</h2>
<button className="close-btn" onClick={closeModalOffre}>×</button>

<form 
  onSubmit={e => { e.preventDefault(); handleSaveOffre(); }} 
  className="employe-form enhanced-form"
>
  <div className="form-grid">

    {/* Département */}
    {/* Département */}
    <div className="form-group">
      <label>Département</label>
<select 
  name="id_depart" 
  value={newOffre.id_depart || ""} 
  onChange={handleOffreChange}
  required
>
        <option value="">-- Sélectionner --</option>
        {departements.map(dep => (
          <option key={dep.id_depart} value={dep.id_depart}>
            {dep.nom_depart}
          </option>
        ))}
      </select>
    </div>

    {/* Profession */}
    <div className="form-group">
      <label>Profession</label>
<select 
  name="id_prof" 
  value={newOffre.id_prof || ""} 
  onChange={handleOffreChange} 
  required
>
  <option value="">-- Sélectionner --</option>
  {professions.map(prof => (
    <option key={prof.id_prof} value={prof.id_prof}>{prof.nom_prof}</option>
  ))}
</select>

    </div>

    {/* Date de publication */}
    <div className="form-group">
      <label>Date de Publication</label>
      <input 
        type="date" 
        name="date_pub" 
        value={newOffre.date_pub} 
        onChange={handleOffreChange} 
        required 
      />
    </div>

    {/* Type d'emploi */}
    <div className="form-group">
      <label>Type d'emploi</label>
      <input 
        type="text" 
        name="type_emploi" 
        value={newOffre.type_emploi} 
        onChange={handleOffreChange} 
        required 
      />
    </div>

    {/* Fichier PDF */}
    <div className="form-group">
      <label>Détail (PDF)</label>
<input 
  type="file" 
  name="detail" 
  accept="application/pdf" 
  onChange={handleOffreChange}
/>

    </div>

  </div>

  <button type="submit" className="save-btn enhanced-save-btn">
    💾 Sauvegarder l’offre
  </button>
</form>
</Modal>

    </div>
    
  );
  



      default:
        return (
          <div className="welcome-card">
            <h2>Bienvenue, {user?.nom} {user?.prenom}</h2>
            <p>Bienvenue dans votre espace admin, vous pouvez naviguer en utilisant les liens en haut !</p>
            <p>Cette interface vous permet de gérer les employés, postes et offres d’emploi.</p>
            <button className="about-btn" onClick={() => setActiveTab('liste-employes')}>À propos</button>
          </div>
        );
    }
  };
  
<Modal isOpen={modalDepOpen} onRequestClose={closeModalDep} className="modal enhanced-modal" overlayClassName="overlay">
  <h2>➕ Ajouter Département</h2>
  <button className="close-btn" onClick={closeModalDep}>×</button>
  <div className="form-group">
    <label>Nom Département</label>
    <input type="text" value={newDepartement} onChange={e => setNewDepartement(e.target.value)} />
  </div>
  <button className="save-btn" onClick={handleSaveDepartement}>💾 Sauvegarder</button>
</Modal>

  return (
    <div className="dashboard-page">
      <nav className="dashboard-nav">
        <div className="nav-logo">TeamLP</div>
        <ul className="nav-links">
          <li onClick={() => setActiveTab('accueil')} className={activeTab==='accueil' ? 'active' : ''}>Accueil</li>
          <li onClick={() => setActiveTab('liste-employes')} className={activeTab==='liste-employes' ? 'active' : ''}>Liste des Employés</li>
          <li onClick={() => setActiveTab('liste-postes')} className={activeTab==='liste-postes' ? 'active' : ''}>Liste des Postes</li>
          <li onClick={() => setActiveTab('offres-emploi')} className={activeTab==='offres-emploi' ? 'active' : ''}>Offres d’emploi</li>
        </ul>
        <button className="logout-icon" onClick={handleLogout}>
          <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
      </nav>

      <main className="dashboard-content">{renderContent()}</main>
    </div>
  );


}
export default AdminDashboard;
