import React, { useEffect, useState } from 'react';
import '../styles/styles.css';
import { Link } from 'react-router-dom';


function Footer() {
  const [tel, setTel] = useState('');
  const [mail, setMail] = useState('');
  const [adresse, setAdresse] = useState('');
  const [sections, setSections] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/site-content`)
      .then(res => {
        if (!res.ok) throw new Error('Erreur lors du chargement des contacts');
        return res.json();
      })
      .then(data => {
        setTel(data.pageContact?.tel || '');
        setMail(data.pageContact?.mail || '');
        setAdresse(data.pageContact?.adresse || '');
      })
      .catch(err => setError(err.message));
    fetch(`${process.env.REACT_APP_BACKEND_URL}/site-content`)
      .then(res => {
        if (!res.ok) throw new Error('Erreur lors du chargement du contenu');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data.pagePartenaire)) {
          setSections(data.pagePartenaire);
        } else {
          setSections([{ titre: data.pagePartenaire?.titre || 'Bienvenue', texte: data.pagePartenaire?.texte || '',image: data.pagePartenaire?.image || '' }]);
        }
      })
      .catch(err => setError(err.message));

  }, []);

  return (
    <footer>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
        <div>
          <h2>Nos Partenaires</h2>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {error ? (
            <p style={{ color: 'red' }}>Erreur : {error}</p>
            ) : (
            sections.slice(0, 4).map((section, index) => (
              <div key={index} >    
                {section.image && (
                  <img
                    src={`${process.env.REACT_APP_BACKEND_URL}${section.image}`}
                    alt={section.titre}
                    style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'cover',
                        borderRadius: '50%',
                        marginBottom: '1px'
                      }}
                    />
                )}
                <h3>{section.titre}</h3>
              </div>
            ))
          )}
          
          </div>
          <div className="bloc-bouton-droit">
            <Link to="/partenaires" className="bouton-droit">
              Voir plus
            </Link>
          </div>
        </div>
        <div>
          <h2>Contacts</h2>
          {error ? (
            <p style={{ color: 'red' }}>Erreur : {error}</p>
          ) : (
            <div>
              <p><strong>Tel :</strong> {tel}</p>
              <p><strong>Mail :</strong> <a href={`mailto:${mail}`} style={{color:"white"}}>{mail}</a></p>
              <p><strong>Adresse :</strong> {adresse}</p>
            </div>
          )}
          <div className="bloc-bouton-droit" style={{justifyContent: 'Center'}}>
            <Link to="/partenaires" className="bouton-droit">
              Contactez nous !
            </Link>
          </div>
        </div>
      </div>
       
      
    </footer>
  );
}

export default Footer;