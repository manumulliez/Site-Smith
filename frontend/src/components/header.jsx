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
        setNomAssociation(data.nomAssociation || 'test 2');
      })
      .catch(err => {
        console.error(err);
        setNomAssociation('test 1');
      });
  }, []);

  return (
    <header >
      <div className="logo-container">
        <img src="/logo192.png" alt="Logo Association" className="logo" />
        <h1>{nomAssociation}</h1>
      </div>
      <nav>
        <Link to="/">Accueil</Link> |{' '}
        <Link to="/publications">Actualités</Link> |{' '}
        <Link to="/login">Espace Admin</Link> |{' '}
        <Link to="/contact">Contacts</Link>
      </nav>
    </header>
  );
}

export default Header;
