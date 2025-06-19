import React, { useEffect, useState } from 'react';
import HeaderAdmin from '../../components/headerAdmin';

function GestionContenu() {
  const [nomAssociation, setNomAssociation] = useState('');
  const [titreAccueil, setTitreAccueil] = useState('');
  const [texteAccueil, setTexteAccueil] = useState(['']);
  const [tel, setTel] = useState('');
  const [mail, setMail] = useState('');
  const [adresse, setAdresse] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Simule la récupération du niveau admin (à adapter selon ton système)
  const adminNiveau = 1; 

  useEffect(() => {
    fetch('${process.env.REACT_APP_BACKEND_URL}/site-content')
      .then(res => {
        if (!res.ok) throw new Error('Erreur chargement contenu site');
        return res.json();
      })
      .then(data => {
        setNomAssociation(data.nomAssociation || '');
        setTitreAccueil(data.pageAccueil?.titre || '');
        setTexteAccueil((data.pageAccueil?.texteAccueil || '' ));
        setTel(data.pageContact?.tel || '');
        setMail(data.pageContact?.mail || '');
        setAdresse(data.pageContact?.adresse || '');
      })
      .catch(err => setError(err.message));
  }, []);


  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const payload = {
      nomAssociation,
      pageAccueil: {
        titre: titreAccueil,
        texteAccueil
      },
      pageContact: {
        tel,
        mail,
        adresse
      },
      adminNiveau // important pour la vérification côté backend
    };

    fetch('${process.env.REACT_APP_BACKEND_URL}/admin/site-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => {
      if (!res.ok) throw new Error('Erreur lors de la sauvegarde');
      return res.json();
    })
    .then(data => {
      setMessage(data.message || 'Contenu mis à jour !');
    })
    .catch(err => setError(err.message));
  };
  

  return (
    <div className="container">
      <HeaderAdmin />
      <h2>Gestion du contenu du site</h2>
      {error && <p style={{ color: 'red' }}>Erreur : {error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}

      <form onSubmit={handleSubmit}>
        <label>Nom de l’association :</label>
        <input type="text" value={nomAssociation} onChange={e => setNomAssociation(e.target.value)} required />

        <h3>Page d’accueil</h3>
        <label>Titre :</label>
        <input type="text" value={titreAccueil} onChange={e => setTitreAccueil(e.target.value)} required />

        <label>Texte d’accueil :</label>
        <textarea 
          value={texteAccueil} 
          onChange={e => setTexteAccueil(e.target.value)}
          rows="8"
          style={{ width: '100%' }}
          required
        />
        

        <h3>Page Contact</h3>
        <label>Téléphone :</label>
        <input type="text" value={tel} onChange={e => setTel(e.target.value)} required />

        <label>Email :</label>
        <input type="email" value={mail} onChange={e => setMail(e.target.value)} required />

        <label>Adresse :</label>
        <input type="text" value={adresse} onChange={e => setAdresse(e.target.value)} required />

        <button type="submit" style={{ marginTop: '20px' }}>Sauvegarder les modifications</button>
      </form>
    </div>
  );
}

export default GestionContenu;
