import React, { useEffect, useState } from 'react';
import '../styles/styles.css';
import Header from '../components/header';

function HomePage() {
  const [titre, setTitre] = useState('');
  const [texteAccueil, setTexteAccueil] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/site-content')
      .then(res => {
        if (!res.ok) throw new Error('Erreur lors du chargement du contenu');
        return res.json();
      })
      .then(data => {
        setTitre(data.pageAccueil?.titre || 'Bienvenue');
        setTexteAccueil(data.pageAccueil?.texteAccueil || '');
      })
      .catch(err => setError(err.message));
  }, []);

  return (
    <div>
      <Header />

      <div className="container">
        {error ? (
          <p style={{ color: 'red' }}>Erreur : {error}</p>
        ) : (
          <>
            <h2>{titre}</h2>
            <p style={{ whiteSpace: 'pre-line' }}>{texteAccueil}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default HomePage;
