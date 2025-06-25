// ProjetPage.jsx
import React, { useEffect, useState } from 'react';
import '../styles/styles.css';
import Header from '../components/header';
import Footer from '../components/footer';

function ProjetPage() {
  const [sections, setSections] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/site-content`)
      .then(res => {
        if (!res.ok) throw new Error('Erreur lors du chargement du contenu');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data.pageProjet)) {
          setSections(data.pageProjet);
        } else {
          setSections([{ titre: data.pageProjet?.titre || 'Bienvenue', texte: data.pageProjet?.texte || '',image: data.pageProjet?.image || '' }]);
        }
      })
      .catch(err => setError(err.message));
  }, []);

  return (
    <div>
      <Header />

      <div className="container">
        <h1>Nos Projets</h1>
        {error ? (
          <p style={{ color: 'red' }}>Erreur : {error}</p>
        ) : (
          sections.map((section, index) => (
            <div key={index}>
              <h3>{section.titre}</h3>
              
              <p style={{ whiteSpace: 'pre-line' }}>{section.texte}</p>
              {section.image && (
                <img
                  src={`${process.env.REACT_APP_BACKEND_URL}${section.image}`}
                  alt={section.titre}
                  style={{ maxWidth: '800px',maxHeight:'300px', display: 'block', margin: '10px auto'}}
                />
              )}
            </div>
          ))
        )}
      </div>
      <Footer/>
    </div>
  );
}

export default ProjetPage;
