import React, {useState } from 'react';
import '../styles/styles.css';
import Header from '../components/header';
import Footer from '../components/footer';

 function ContactPage() {
  
  const [nom, setNom] = useState('');
  const [mail, setMail] = useState('');
  const [message, setMessage] = useState('');
  const [contenu, setContenu] = useState('');
  
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!nom || !mail || !contenu) {
    setMessage("❌ Tous les champs sont obligatoires.");
    return;
  }

  try {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nom, mail, contenu }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage('✅ Message envoyé !');
      setNom('');
      setMail('');
      setContenu('');
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
      <Header />
      <div className="container">
        <h2>Contacts</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <label>Nom :</label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />

          <label>Mail :</label>
          <input
            value={mail}
            type="email"
            onChange={(e) => setMail(e.target.value)}
            required
          />

          <label>Contenu :</label>
          <textarea
            type="text"
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            required
          />

          <button type="submit">Publier</button>
        </form>

        {message && <p style={{ marginTop: '10px' }}>{message}</p>}
      </div>
      <Footer/>
    </div>
  );
}

export default ContactPage;

