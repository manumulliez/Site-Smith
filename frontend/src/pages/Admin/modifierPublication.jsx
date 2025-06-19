// src/pages/ModifierPublication.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderAdmin from '../../components/headerAdmin';

function ModifierPublication() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [titre, setTitre] = useState('');
  const [contenu, setContenu] = useState('');
  const [auteur, setAuteur] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (isAdmin !== "true") {
      window.location.href = "/login";
    }
    
    fetch('${process.env.REACT_APP_BACKEND_URL}/publications')
      .then(res => res.json())
      .then(data => {
        const pub = data.find(p => p.id.toString() === id);
        if (pub) {
          setTitre(pub.titre);
          setContenu(pub.contenu);
          setAuteur(pub.auteur);
          setPreview('${process.env.REACT_APP_BACKEND_URL}/${pub.image}');
        }
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('titre', titre);
    formData.append('contenu', contenu);
    formData.append('auteur', auteur);
    if (image) formData.append('image', image);

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/publications/${id}`, {
        method: 'PUT',
        body: formData
      });

      if (res.ok) {
        setMessage("✅ Publication mise à jour avec succès !");
        setTimeout(() => navigate('/gestion-publication'), 1500);
      } else {
        setMessage("❌ Erreur lors de la mise à jour.");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Erreur serveur.");
    }
  };

  return (
    <div>
      <HeaderAdmin />
      <div className="container">
        <h2>✏️ Modifier une publication</h2>
        <form onSubmit={handleSubmit}>
          <label>Titre :</label>
          <input type="text" value={titre} onChange={(e) => setTitre(e.target.value)} required />

          <label>Contenu :</label>
          <textarea className="zone-texte" value={contenu} onChange={(e) => setContenu(e.target.value)} required />
            

          <label>Auteur :</label>
          <input type="text" value={auteur} onChange={(e) => setAuteur(e.target.value)} required />

          <label>Nouvelle image (facultatif) :</label>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} accept="image/*" />
          {preview && <img src={preview} alt="aperçu" style={{ maxWidth: '200px', marginTop: '10px' }} />}

          <button type="submit">Mettre à jour</button>
          {message && <p>{message}</p>}
        </form>
      </div>
    </div>
  );
}

export default ModifierPublication;
