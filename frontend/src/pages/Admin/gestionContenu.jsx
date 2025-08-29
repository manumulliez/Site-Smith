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
  const [banderole, setBanderole] =  useState({ imageFile: null, imagePreview: null });;
  const [error, setError] = useState('');

  const [pageProjet, setProjet] = useState([
    { titre: '', texte: '', imageFile: null, imagePreview: null }
  ]);
  const [pageMembre, setMembre] = useState([
    { nom: '', role: '',pole:'', imageFile: null, imagePreview: null }
  ]);
  const [pagePartenaire, setPartenaire] = useState([
    { titre: '', texte: '', imageFile: null, imagePreview: null }
  ]);
  const [poles, setPoles] = useState([]);

  const [ongletActif, setOngletActif] = useState("accueil");
  const adminNiveau = 1;

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/site-content`)
      .then(res => {
        if (!res.ok) throw new Error('Erreur chargement contenu site');
        return res.json();
      })
      .then(data => {
        setNomAssociation(data.nomAssociation || '');

        const formatArray = (items, fallback) => {
          return Array.isArray(items) ?
            items.map(p => ({ ...p, imageFile: null, imagePreview: p.image || null })) :
            [fallback];
        };

        setSections(formatArray(data.pageAccueil, { titre: '', texte: '', imageFile: null, imagePreview: null }));
        setProjet(formatArray(data.pageProjet, { titre: '', texte: '', imageFile: null, imagePreview: null }));
        setMembre(formatArray(data.pageMembre, { nom: '', role: '', pole: '', imageFile: null, imagePreview: null }));
        setPartenaire(formatArray(data.pagePartenaire, { titre: '', texte: '', imageFile: null, imagePreview: null }));
        
        setBanderole({ imageFile: null,imagePreview: data.banderole || null });
        setPoles(data.poles || [""]);
        setTel(data.pageContact?.tel || '');
        setMail(data.pageContact?.mail || '');
        setAdresse(data.pageContact?.adresse || '');
      })
      .catch(err => setError(err.message));
  }, []);

  const handleImageChange = (setState, index, file) => {
    setState(prev => {
      const updated = [...prev];
      updated[index].imageFile = file;
      updated[index].imagePreview = URL.createObjectURL(file);
      return updated;
    });
  };

  const handleRemoveImage = (setState, index) => {
    setState(prev => {
      const updated = [...prev];
      updated[index].imageFile = "";
      updated[index].imagePreview = "";
      return updated;
    });
  };


  const handleChange = (setState, index, key, value) => {
    setState(prev => {
      const updated = [...prev];
      updated[index][key] = value;
      return updated;
    });
  };

  const addEntry = (setState, template) => {
    setState(prev => [...prev, { ...template }]);
  };
  const removeEntry = (setState, index) => {
    setState(prev => prev.filter((_, i) => i !== index));
  };


   const addPole = () => {
    const nouveauPole = prompt("Nom du nouveau pôle :");
    if (nouveauPole) setPoles(prev => [...prev, nouveauPole]);
  };
  const removePole = (index) => {
    setPoles(prev => prev.filter((_, i) => i !== index));
  };


  const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage('');
  setError('');

  const formData = new FormData();
  const allImages = [];

  const processSection = (array) =>
  array.map(item => {
    const { imageFile, imagePreview, ...rest } = item;

    // Nouvelle image à uploader
    if (imageFile) {
      allImages.push(imageFile);
      return { ...rest, image: "newImage" }; // 👈 on marque comme "nouvelle image"
    }

    // Image déjà existante
    if (imagePreview && typeof imagePreview === 'string' && imagePreview.startsWith('/uploads/')) {
      return { ...rest, image: imagePreview };
    }

    // Image supprimée
    return { ...rest, image: null };
  });

  const data = {
    nomAssociation,
    banderole :  banderole.imageFile? "newImage" : (banderole.imagePreview && banderole.imagePreview.startsWith('/uploads/') ? banderole.imagePreview : null),
    pageAccueil: processSection(sections),
    pageProjet: processSection(pageProjet),
    pageMembre: processSection(pageMembre),
    pagePartenaire: processSection(pagePartenaire),
    pageContact: { tel, mail, adresse },
    poles,
    adminNiveau
  };

  // 🖼️ Banderole dans un champ séparé
  if (banderole.imageFile) {
    formData.append("banderole", banderole.imageFile);
  }
  allImages.forEach(img => formData.append("images", img));
  formData.append("data", JSON.stringify(data));
  
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


  const renderSectionForm = (label, data, setData, template, titleField = 'titre', textField = 'texte') => (
    <>
      {data.map((item, index) => (
        <div key={index} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc' }}>
          <label>{label} :</label>
          <input
            type="text"
            value={item[titleField]}
            onChange={e => handleChange(setData, index, titleField, e.target.value)}
            required
          />
          <label>Description :</label>
          <textarea
            value={item[textField]}
            onChange={e => handleChange(setData, index, textField, e.target.value)}
            rows="6"
            style={{ width: '100%' }}
            required
          />
          <label>Image :</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => handleImageChange(setData, index, e.target.files[0])}
          />
          {item.imagePreview && (
            <div>
              <img src={item.imagePreview} alt="aperçu" style={{ maxWidth: '150px', marginTop: '10px' }} />
              <br />
              <button type="button" onClick={() => handleRemoveImage(setData, index)}>Supprimer l’image</button>
            </div>
          )}
        </div>
      ))}
      <button type="button" onClick={() => addEntry(setData, template)} style={{ marginTop: '10px' }}>Ajouter</button>
    </>
  );



  return (
    <div>
      <HeaderAdmin />
      <div className="container">
        <h2>Gestion du contenu du site</h2>
        {error && <p style={{ color: 'red' }}>Erreur : {error}</p>}
        {message && <p style={{ color: 'green' }}>{message}</p>}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button onClick={() => setOngletActif("accueil")}>Accueil</button>
          <button onClick={() => setOngletActif("membres")}>Membres</button>
          <button onClick={() => setOngletActif("partenaires")}>Partenaires</button>
          <button onClick={() => setOngletActif("projets")}>Projets</button>
          <button onClick={() => setOngletActif("contact")}>Contact</button>
        </div>
        <form onSubmit={handleSubmit}>
          {ongletActif === "accueil" && (
            <>
              <label>Nom de l’association :</label>
              <input type="text" value={nomAssociation} onChange={e => setNomAssociation(e.target.value)} required />
              <h3>Page d’accueil</h3>
              <h4>Banderole (900px par 150px)</h4>
              <input
                type="file"
                accept="image/*"
                onChange={e => setBanderole({
                  imageFile: e.target.files[0],
                  imagePreview: URL.createObjectURL(e.target.files[0])
                })}
              />
              {banderole.imagePreview && (
                <div>
                  <img 
                    src={banderole.imageFile 
                      ? banderole.imagePreview 
                      : `${process.env.REACT_APP_BACKEND_URL}${banderole.imagePreview}`} 
                    alt="Banderole" 
                    style={{ maxWidth: '100%', marginTop: '10px' }} 
                  />
                  <br />
                  <button type="button" onClick={() => setBanderole({ imageFile: null, imagePreview: null })}>
                    Supprimer la banderole
                  </button>
                </div>
              )}
              {renderSectionForm("Titre", sections, setSections, { titre: '', texte: '', imageFile: null, imagePreview: null })}
            </>
          )}

          {ongletActif === "membres" && (
           <>
              <h3>Membres de l'association</h3>
              <button type="button" onClick={addPole}>Ajouter un pôle</button>
              <ul>
                {poles.map((pole, idx) => (
                  <li key={idx}>
                    {pole} <button type="button" onClick={() => removePole(idx)}>Supprimer</button>
                  </li>
                ))}
              </ul>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {pageMembre.map((item, index) => (
                  <div key={index} style={{ width: '250 px', border: '2px solid rgb(89, 89, 89)', padding: '10px' }}>
                    <label>Nom :</label>
                    <input
                      type="text"
                      value={item.nom}
                      onChange={e => handleChange(setMembre, index, 'nom', e.target.value)}
                      required
                    />
                    <label>Rôle :</label>
                    <input
                      type="text"
                      value={item.role}
                      onChange={e => handleChange(setMembre, index, 'role', e.target.value)}
                      required
                    />
                    <label>Pôle :</label>
                    <select
                      value={item.pole || ''}
                      onChange={e => handleChange(setMembre, index, 'pole', e.target.value)}>
                      <option value="">-- Choisir un pôle --</option>
                      {poles.map((pole, idx) => (
                        <option key={idx} value={pole}>{pole}</option>
                      ))}
                    </select>
                    <label>Image :</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleImageChange(setMembre, index, e.target.files[0])}
                    />
                    {item.imagePreview && (
                      <div>
                        <img src={item.imagePreview} alt="aperçu" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }} />
                        <br />
                        <button type="button" onClick={() => handleRemoveImage(setMembre, index)}>Supprimer l’image</button>
                      </div>
                    )}
                    <br />
                    <button type="button" onClick={() => removeEntry(setMembre, index)} style={{ marginTop: '10px' }}>Supprimer le membre</button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => addEntry(setMembre, { nom: '', role: '', pole: '', imageFile: null, imagePreview: null })} style={{ marginTop: '10px' }}>Ajouter un membre</button>
            </>
          )}

          {ongletActif === "partenaires" && (
            <>
              <h3>Partenaires</h3>
              {renderSectionForm("Nom partenaire", pagePartenaire, setPartenaire, { titre: '', texte: '', imageFile: null, imagePreview: null })}
            </>
          )}

          {ongletActif === "projets" && (
            <>
              <h3>Projets</h3>
              {renderSectionForm("Titre projet", pageProjet, setProjet, { titre: '', texte: '', imageFile: null, imagePreview: null })}
            </>
          )}

          {ongletActif === "projets" && (
            <>
              <h3>Projets</h3>
              {renderSectionForm("Titre projet", pageProjet, setProjet, { titre: '', texte: '', imageFile: null, imagePreview: null })}
            </>
          )}

          {ongletActif === "contact" && (
            <>
              <h3>Contact</h3>
              <label>Téléphone :</label>
              <input type="text" value={tel} onChange={e => setTel(e.target.value)} required />
              <label>Email :</label>
              <input type="email" value={mail} onChange={e => setMail(e.target.value)} required />
              <label>Adresse :</label>
              <input type="text" value={adresse} onChange={e => setAdresse(e.target.value)} required />
            </>
          )}
          <br />
          <button type="submit" style={{ marginTop: '20px' }}>Sauvegarder les modifications</button>
        </form>
      </div>
    </div>
  );
}

export default GestionContenu;
