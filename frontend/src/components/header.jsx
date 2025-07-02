// src/components/Header.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Header() {
  const [nomAssociation, setNomAssociation] = useState('Association');

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/site-content`)
      .then(res => {
        if (!res.ok) throw new Error('Erreur lors du chargement du nom');
        return res.json();
      })
      .then(data => {
        setNomAssociation(data.nomAssociation || 'Cameroon Environmental Champions');
      })
      .catch(err => {
        console.error(err);
        setNomAssociation('Cameroon Environmental Champions');
      });
  }, []);

  return (
    <header >
      <div className="logo-container">
        <img src="/logo192.jpeg" alt="Logo Association" className="logo" />
        <h1>{nomAssociation}</h1>
      </div>
      <nav>
        <Link to="/">Accueil</Link> |{' '}
        <Link to="/publications">Actualités</Link> |{' '}
        <Link to="/projets">Nos Projets</Link>|{' '}
        <Link to="/donation">Donation</Link>|{' '}
        <Link to="/membres">Membres</Link>|{' '}
        <Link to="/partenaires">Nos Partenaires</Link>|{' '}
        <Link to="/contact">Contacts</Link>|{' '}
        <Link to="/login">Espace Admin</Link> 
      </nav>
    </header>
  );
}

export default Header;
