import React, { useEffect, useState } from 'react';
import '../styles/styles.css';


function Footer() {
  const [tel, setTel] = useState('');
  const [mail, setMail] = useState('');
  const [adresse, setAdresse] = useState('');
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
  }, []);

  return (
    <footer>
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
      </div>
    </footer>
  );
}

export default Footer;