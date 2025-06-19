// src/components/Header.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Header() {
  const [nomAssociation, setNomAssociation] = useState('Association');

  useEffect(() => {
    fetch('http://localhost:3000/site-content')
      .then(res => {
        if (!res.ok) throw new Error('Erreur lors du chargement du nom');
        return res.json();
      })
      .then(data => {
        setNomAssociation(data.nomAssociation || 'Association');
      })
      .catch(err => {
        console.error(err);
        setNomAssociation('Association');
      });
  }, []);

  return (
    <header>
      <h1>{nomAssociation}</h1>
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
