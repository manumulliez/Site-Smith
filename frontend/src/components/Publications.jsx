import React, { useEffect, useState } from 'react';

function Publications() {
  const [publications, setPublications] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/publications')
      .then(res => {
        if (!res.ok) throw new Error('Erreur lors du chargement');
        return res.json();
      })
      .then(data => setPublications(data))
      .catch(err => setError(err.message));
  }, []);

  if (error) {
    return <div>Erreur : {error}</div>;
  }
  const sortedPublications = [...publications].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  return (
    <div>
      <h2>Nos publications</h2>
      {publications.length === 0 ? (
        <p>Aucune publication pour le moment.</p>
      ) : (
        sortedPublications.map(pub => (
          <div key={pub.id} style={{ borderBottom: '1px solid #ccc', marginBottom: 10, paddingBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>{pub.titre}</h3>
              <p className="date-publication" style={{ margin: 0, fontStyle: 'italic' }}>
                Publié par {pub.auteur} le {new Date(pub.date).toLocaleDateString()}
              </p>
            </div>
            {pub.image && (
              <img
                src={`http://localhost:3000${pub.image}`}
                alt={pub.titre}
                style={{ maxWidth: '300px', display: 'block', marginBottom: '10px' }}
              />
            )}
            <p style={{ whiteSpace: 'pre-wrap' }}>{pub.contenu}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Publications;
