import React, { useEffect, useState } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';

const MembrePage = () => {
  const [membres, setMembres] = useState([]);
  const [poles, setPoles] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/site-content`)
      .then(res => res.json())
      .then(data => {
        setMembres(data.pageMembre || []);
        setPoles(data.poles || []);
      });
  }, []);

  const membresParPole = {};
  membres.forEach(m => {
    const pole = m.pole || "Autres";
    if (!membresParPole[pole]) membresParPole[pole] = [];
    membresParPole[pole].push(m);
  });

  return (
    <div>
      <Header />
      <div className="container">
        <h2>Membres de l'association</h2>
        {Object.entries(membresParPole).map(([pole, membresDuPole]) => (
          <div key={pole} style={{ marginBottom: '40px' }}>
            <h3>{pole}</h3>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '20px'
            }}>
              {membresDuPole.map((membre, index) => (
                <div key={index} style={{
                  width: '150px',
                  textAlign: 'center'
                }}>
                  {membre.image && (
                    <img
                      src={`${process.env.REACT_APP_BACKEND_URL}${membre.image}`}
                      alt={membre.nom}
                      style={{
                        width: '120px',
                        height: '120px',
                        objectFit: 'cover',
                        borderRadius: '50%',
                        marginBottom: '10px'
                      }}
                    />
                  )}
                  <strong>{membre.nom}</strong>
                  <p style={{ fontStyle: 'italic' }}>{membre.role}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default MembrePage;
