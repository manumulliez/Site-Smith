import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function HeaderAdmin() {
  const admin = JSON.parse(localStorage.getItem("adminConnecte"));
  const [nomAssociation, setNomAssociation] = useState('Association');

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/site-content`)
      .then(res => res.json())
      .then(data => setNomAssociation(data.nomAssociation || 'Association'))
      .catch(() => setNomAssociation('Association'));
  }, []);

  return (
    <header>
      <h1>{nomAssociation} – Interface Admin</h1>
      <h3 style={{ fontWeight: 100 }}>Connecté en tant que {admin.nom}</h3>
      <nav>
        <Link to="/admin">Accueil Admin</Link> |{' '}

        {admin.niveau === 1 && (
          <>
            <Link to="/gestion-admin">Gestion des Admins</Link> |{' '}
          </>
        )}

        <Link to="/gestion-publications">Gestion des publications</Link> |{' '}
        <Link to="/gestion-contenu">Gestion du contenu</Link> |{' '}
        <Link to="/message">Gestion des messages</Link> |{' '}
        <button onClick={() => {
          localStorage.clear();
          window.location.href = "/login";
        }}>
          Déconnexion
        </button>
      </nav>
    </header>
  );
}

export default HeaderAdmin;
