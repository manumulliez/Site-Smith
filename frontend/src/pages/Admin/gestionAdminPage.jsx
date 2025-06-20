// src/pages/GestionAdmins.jsx
import React, { useEffect, useState } from 'react';
import HeaderAdmin from '../../components/headerAdmin';


function GestionAdmins() {
  const [admins, setAdmins] = useState([]);
  const [error, setError] = useState(null);
  const admin = JSON.parse(localStorage.getItem("adminConnecte"));
  
  //données nouvel admin
  const [nouvelAdmin, setNouvelAdmin] = useState({
    nom: '',
    username: '',
    password: '',
    niveau: '2'
  });
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    console.log(isAdmin);
    if (isAdmin === "false" ) { 
      window.location.href = "/login";
      console.log('retour');
    }
    fetch('${process.env.REACT_APP_BACKEND_URL}/admins')
      .then(res => {
        if (!res.ok) throw new Error("Erreur lors du chargement des administrateurs");
        return res.json();
      })
      .then(data => setAdmins(data))
      .catch(err => setError(err.message));
  }, []);

  const supprimerAdmin = async (username) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet administrateur ?")) return;

    try {
      const res = await fetch('${process.env.REACT_APP_BACKEND_URL}/admins/${username}', {
        method: 'DELETE',
      });

      if (res.ok) {
        setAdmins(prev => prev.filter(admin => admin.username !== username));
      } else {
        alert("Erreur lors de la suppression");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur serveur");
    }
  };

  //nouvel admin
  const handleChange = (e) => {
    setNouvelAdmin({ ...nouvelAdmin, [e.target.name]: e.target.value });
  };

  const handleAjouterAdmin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nouvelAdmin)
      });

      if (res.ok) {
        const nouveau = await res.json();
        setAdmins(prev => [...prev, nouveau]);
        setNouvelAdmin({ nom: '', username: '', password: '', niveau: '2' });
        setFormVisible(false);
      } else {
        alert("Erreur lors de l'ajout");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    }
  };
  if (admin.niveau === 1) {return (
    <div>
          <HeaderAdmin />
    
          <div className="container">
            <h2>Gestion des administrateurs</h2>
              <button onClick={() => setFormVisible(!formVisible)}>
                      {formVisible ? "❌ Annuler" : "➕ Ajouter un admin"}
                    </button>

                    {formVisible && (
                      <form onSubmit={handleAjouterAdmin} style={{ marginTop: '20px' }}>
                        <input
                          type="text"
                          name="nom"
                          placeholder="Nom"
                          value={nouvelAdmin.nom}
                          onChange={handleChange}
                          required
                        />
                        <input
                          type="text"
                          name="username"
                          placeholder="Nom d’utilisateur"
                          value={nouvelAdmin.username}
                          onChange={handleChange}
                          required
                        />
                        <input
                          type="password"
                          name="password"
                          placeholder="Mot de passe"
                          value={nouvelAdmin.password}
                          onChange={handleChange}
                          required
                        />
                        <select
                          name="niveau"
                          value={nouvelAdmin.niveau}
                          onChange={handleChange}
                        >
                          <option value="1">Admin principal (niveau 1)</option>
                          <option value="2">Admin secondaire (niveau 2)</option>
                        </select>
                        <button type="submit">Créer</button>
                      </form>
                    )}
                    {error && <p style={{ color: 'red' }}>{error}</p>}

      {admins.length === 0 ? (
        <p>Aucun administrateur enregistré.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Nom d'utilisateur</th>
              <th>Mot de passe</th>
              <th>Niveau</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.username}>
                <td>{admin.nom}</td>
                <td>{admin.username}</td>
                <td>{admin.password}</td>
                <td>{admin.niveau}</td>
                <td>
                  <button onClick={() => supprimerAdmin(admin.username)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
          </div>
            
        </div>
    
  );} else {
    return(<div>
          <HeaderAdmin />
    
          <div className="container">
            <h2>Page réservé aux admins de niveau 1</h2>
            
          </div></div>  
          );
  }
  
}

export default GestionAdmins;
