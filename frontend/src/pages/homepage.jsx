// HomePage.jsx
import React, { useEffect, useState } from 'react';
import '../styles/styles.css';
import Header from '../components/header';
import Footer from '../components/footer';
import { Link } from 'react-router-dom';

function HomePage() {
  const [sections, setSections] = useState([]);
  const [publications, setPublications] = useState([]);
  const [banderole, setBanderole] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/site-content`)
      .then(res => {
        if (!res.ok) throw new Error('Erreur lors du chargement du contenu');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data.pageAccueil)) {
          setSections(data.pageAccueil);
        } else {
          setSections([{ 
            titre: data.pageAccueil?.titre || 'Bienvenue', 
            texte: data.pageAccueil?.texte || '', 
            image: data.pageAccueil?.image || '' 
          }]);
        }
        setBanderole(data.banderole || '');
      })
      .catch(err => setError(err.message));
    fetch(`${process.env.REACT_APP_BACKEND_URL}/publications`)
      .then(res => {
        if (!res.ok) throw new Error('Erreur lors du chargement');
        return res.json();
      })
      .then(data => setPublications(data))
      .catch(err => setError(err.message));
  }, []);

  const sortedPublications = [...publications].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div>
      <Header />

      <div className="container">
        {banderole && (
          <div style={{ width: '100%', height: '150px', overflow: 'hidden' }}>
            <img 
              src={`${process.env.REACT_APP_BACKEND_URL}${banderole}`} 
              alt="Banderole" 
              style={{ 
                width: '100%', 
                height: '100%', 
                borderRadius: '10px',
                objectFit: 'contain' // ou 'contain' selon le rendu souhaité
              }}
            />
          </div>
        )}

        {error ? (
          <p style={{ color: 'red' }}>Erreur : {error}</p>
        ) : (
          <div className="article-container">
            {sections.map((section, index) => (
              <div key={index} className="article-card">
                <div style={{textAlign : 'center'}}>
                {section.image && (
                  <img
                    src={`${process.env.REACT_APP_BACKEND_URL}${section.image}`}
                    alt={section.titre}
                  />
                )}
                </div>
                <h3>{section.titre}</h3>
                <p style={{ whiteSpace: 'pre-line' }}>{section.texte}</p>
                
              </div>
            ))}
          </div>
        )}
        <div className="article-card">
          <h2>Nos publications</h2>
          {publications.length === 0 ? (
            <p>Aucune publication pour le moment.</p>
          ) : (
            sortedPublications.slice(0, 2).map(pub => (
              <div key={pub.id} style={{ borderBottom: '1px solid #ccc', marginBottom: 10, paddingBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3>{pub.titre}</h3>
                  <p className="date-publication" style={{ margin: 0, fontStyle: 'italic' }}>
                    Publié par {pub.auteur} le {new Date(pub.date).toLocaleDateString()}
                  </p>
                </div>
                {pub.image && (
                  <img
                    src={`${process.env.REACT_APP_BACKEND_URL}${pub.image}`}
                    alt={pub.titre}
                    style={{ maxWidth: '300px', display: 'block', marginBottom: '10px' }}
                  />
                )}
                <p style={{ whiteSpace: 'pre-wrap' }}>{pub.contenu}</p>
                
              </div>
            ))
          )}
          <Link to="/publications">Actualités</Link>
        </div>
      </div>
      
      <Footer/>
    </div>
  );
}

export default HomePage;
