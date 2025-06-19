import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderAdmin from '../../components/headerAdmin';

function AdminPage() {
  const [publications, setPublications] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (isAdmin !== "true") {
      navigate('/login');
    }

    chargerPublications();
  }, [navigate]);

  const chargerPublications = () => {
    fetch('http://localhost:3000/publications')
      .then(res => res.json())
      .then(data => setPublications(data.reverse()))
      .catch(() => setError('Erreur de chargement des publications'));
  };

  const supprimerPublication = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette publication ?")) return;

    try {
      const res = await fetch(`http://localhost:3000/admin/publications/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setPublications(prev => prev.filter(pub => pub.id !== id));
      } else {
        alert("Erreur lors de la suppression.");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur serveur.");
    }
  };

  return (
    <div>
      <HeaderAdmin />

      <div className="container">
        <h2>🗂️ Gestion des publications</h2>

        <div style={{ margin: '20px 0' }}>
          <button onClick={() => navigate('/ajouter-publication')}>
            ➕ Ajouter une publication
          </button>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {publications.length === 0 ? (
          <p>Aucune publication enregistrée.</p>
        ) : (
          publications.map(pub => (
            <div key={pub.id} style={{ borderBottom: '1px solid #ccc', marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>{pub.titre}</h3>
                <p className="date-publication" style={{ margin: 0, fontStyle: 'italic' }}>
                  Publié par {pub.auteur} le {new Date(pub.date).toLocaleDateString()}
                </p>
              </div>
              {pub.image && (
                <img src={`http://localhost:3000${pub.image}`} alt={pub.titre} style={{ maxWidth: '200px' }} />
              )}
              
              <p style={{ whiteSpace: 'pre-wrap' }}>{pub.contenu}</p>

              <button onClick={() => navigate(`/modifier-publication/${pub.id}`)}>✏️ Modifier</button>
              <button onClick={() => supprimerPublication(pub.id)} style={{ marginLeft: 10, color: 'red' }}>
                ❌ Supprimer
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminPage;
