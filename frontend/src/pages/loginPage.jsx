import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/styles.css'; // adapte le chemin si nécessaire
import Header from '../components/header';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem("isAdmin", "true");
        const adminData = {
          username: data.username,
          nom: data.nom,
          niveau: data.niveau,
        };
        localStorage.setItem("adminConnecte", JSON.stringify(adminData));
        navigate("/admin");
     
      } else {
        setMessage('❌ Identifiants incorrects.');
      }
    } catch (error) {
      console.error(error);
      setMessage('❌ Erreur de connexion au serveur.');
    }
  };

  return (
    <div>
      <Header />

      <div className="container">
        <h2>Connexion administrateur</h2>
        <form onSubmit={handleLogin}>
          <label htmlFor="username">Nom d’utilisateur</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Entrez votre nom d’utilisateur"
          />

          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Entrez votre mot de passe"
          />

          <button type="submit">Se connecter</button>
        </form>

        {message && <p style={{ marginTop: '10px' }}>{message}</p>}
      </div>
    </div>
  );
}

export default LoginPage;
