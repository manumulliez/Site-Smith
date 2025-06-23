// GestionContenu.jsx
import React, { useEffect, useState } from 'react';
import HeaderAdmin from '../../components/headerAdmin';

function GestionContenu() {
  const [nomAssociation, setNomAssociation] = useState('');
  const [sections, setSections] = useState([
    { titre: '', texte: '', imageFile: null, imagePreview: null }
  ]);
  const [tel, setTel] = useState('');
  const [mail, setMail] = useState('');
  const [adresse, setAdresse] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const adminNiveau = 1;

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/site-content`)
      .then(res => {
        if (!res.ok) throw new Error('Erreur chargement contenu site');
        return res.json();
      })
      .then(data => {
        setNomAssociation(data.nomAssociation || '');
        if (Array.isArray(data.pageAccueil)) {
          setSections(
            data.pageAccueil.map(p => ({
              ...p,
              imageFile: null,
              imagePreview: p.image || null
            }))
          );
        } else {
          setSections([
            {
              titre: data.pageAccueil?.titre || '',
              texte: data.pageAccueil?.texteAccueil || '',
              imageFile: null,
              imagePreview: null
            }
          ]);
        }
        setTel(data.pageContact?.tel || '');
        setMail(data.pageContact?.mail || '');
        setAdresse(data.pageContact?.adresse || '');
      })
      .catch(err => setError(err.message));
  }, []);

  const handleSectionChange = (index, key, value) => {
    const updated = [...sections];
    updated[index][key] = value;
    setSections(updated);
  };

  const handleImageChange = (index, file) => {
    const updated = [...sections];
    updated[index].imageFile = file;
    updated[index].imagePreview = URL.createObjectURL(file);
    setSections(updated);
  };

  const handleRemoveImage = (index) => {
    const updated = [...sections];
    updated[index].imageFile = null;
    updated[index].imagePreview = null;
    setSections(updated);
  };

  const addSection = () => {
    setSections([...sections, { titre: '', texte: '', imageFile: null, imagePreview: null }]);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage('');
  setError('');

  const formData = new FormData();

  // Ajout des images dans une seule clé "images"
  const sectionData = sections.map((s) => {
    if (s.imageFile) {
      formData.append('images', s.imageFile); // toutes les images sous la même clé
    }
    return {
      titre: s.titre,
      texte: s.texte,
      image: s.imagePreview || null // utilisé en preview, sera remplacé côté backend si nouveau fichier
    };
  });

  // Construire l'objet global pour le contenu du site
  const data = {
    nomAssociation,
    pageAccueil: sectionData,
    pageContact: {
      tel,
      mail,
      adresse
    },
    adminNiveau
  };

  // L'envoyer en JSON stringifié sous la clé "data"
  formData.append('data', JSON.stringify(data));

  // Envoi au serveur
  fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/site-content`, {
    method: 'POST',
    body: formData
  })
    .then(res => {
      if (!res.ok) throw new Error('Erreur lors de la sauvegarde');
      return res.json();
    })
    .then(data => setMessage(data.message || 'Contenu mis à jour !'))
    .catch(err => setError(err.message));
};


  return (
    <div>
      <HeaderAdmin />
      <div className="container">
        <h2>Gestion du contenu du site</h2>
        {error && <p style={{ color: 'red' }}>Erreur : {error}</p>}
        {message && <p style={{ color: 'green' }}>{message}</p>}

        <form onSubmit={handleSubmit}>
          <label>Nom de l’association :</label>
          <input type="text" value={nomAssociation} onChange={e => setNomAssociation(e.target.value)} required />

          <h3>Page d’accueil</h3>
          {sections.map((section, index) => (
            <div key={index} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc' }}>
              <label>Titre :</label>
              <input
                type="text"
                value={section.titre}
                onChange={e => handleSectionChange(index, 'titre', e.target.value)}
                required
              />
              <label>Texte :</label>
              <textarea
                value={section.texte}
                onChange={e => handleSectionChange(index, 'texte', e.target.value)}
                rows="6"
                style={{ width: '100%' }}
                required
              />
              <label>Image :</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => handleImageChange(index, e.target.files[0])}
              />
              {section.imagePreview && (
                <div>
                  <img src={section.imagePreview} alt="aperçu" style={{ maxWidth: '150px', marginTop: '10px' }} />
                  <br />
                  <button type="button" onClick={() => handleRemoveImage(index)}>Supprimer l’image</button>
                </div>
              )}
            </div>
          ))}

          <button type="button" onClick={addSection} style={{ marginTop: '10px' }}>Ajouter une section</button>

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
    </div>
  );
}

export default GestionContenu;
