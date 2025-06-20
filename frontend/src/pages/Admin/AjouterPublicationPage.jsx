import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderAdmin from '../../components/headerAdmin';


function AjouterPublicationPage() {
  const [titre, setTitre] = useState('');
  const [contenu, setContenu] = useState('');
  const [image, setImage] = useState(null);
  const [auteur, setAuteur] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem('adminConnecte');
    if (!isAdmin) {
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!titre || !contenu || !image || !auteur) {
      setMessage("❌ Tous les champs sont obligatoires.");
      return;
    }

    const formData = new FormData();
    formData.append('titre', titre);
    formData.append('contenu', contenu);
    formData.append('image', image);
    formData.append('auteur', auteur);

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/publications`, {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Publication ajoutée !');
        setTitre('');
        setContenu('');
        setImage(null);
        setAuteur('');
        setTimeout(() => navigate('/admin'), 1500);
      } else {
        setMessage(`❌ Erreur : ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Erreur lors de l'envoi.");
    }
  };

  return (
    <div>
      <HeaderAdmin />

      <div className="container">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <label>Titre :</label>
          <input
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            required
          />

          <label>Contenu :</label>
          <textarea
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            required
          />

          <label>Auteur :</label>
          <input
            type="text"
            value={auteur}
            onChange={(e) => setAuteur(e.target.value)}
            required
          />

          <label>Image :</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />

          <button type="submit">Publier</button>
        </form>

        {message && <p style={{ marginTop: '10px' }}>{message}</p>}
      </div>
    </div>
  );
}

export default AjouterPublicationPage;
