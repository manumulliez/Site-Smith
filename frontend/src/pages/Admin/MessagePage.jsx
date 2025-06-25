import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderAdmin from '../../components/headerAdmin';

function MessagePage() {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (isAdmin !== "true") {
      navigate('/login');
      return;
    }

    chargerMessages();
  }, [navigate]);

  const chargerMessages = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/contact`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMessages(data.reverse());
        } else {
          setError('Format de données invalide');
        }
      })
      .catch(() => setError('Erreur de chargement des messages'));
  };

  const supprimerMessage = async (id) => {
  if (!window.confirm("Voulez-vous vraiment supprimer ce message ?")) return;

  try {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/messages/${id}`, {
      method: 'DELETE'
    });

    const data = await res.json(); // Ajout
    if (res.ok) {
      setMessages(prev => prev.filter(msg => msg.id !== id));
    } else {
      alert(`Erreur lors de la suppression : ${data.message}`);
    }
  } catch (error) {
    console.error(error);
    alert("Erreur serveur.");
  }
};


  return (
    <div>
      <HeaderAdmin />
      <div className="container">
        <h2>🗂️ Gestion des Messages</h2>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {messages.length === 0 && !error ? (
          <p>Aucun message enregistré.</p>
        ) : (
          messages.map(msg => (
            <div key={msg.id} style={{ 
              border: '2px solid #636363', 
              borderRadius: '8px', 
              padding: '10px', 
              marginBottom: '15px' 
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p><strong>Nom :</strong> {msg.nom}</p>
                    <p><strong>Mail :</strong> {msg.mail}</p>
                </div>
                <p style={{ whiteSpace: 'pre-wrap',background:"rgba(255, 255, 255, 0.8) ", borderRadius: '8px',padding: '5px',}}><strong>Contenu :</strong><br />{msg.contenu}</p>

                <button 
                    onClick={() => supprimerMessage(msg.id)} 
                    style={{ marginTop: '10px', color: 'RED', backgroundColor: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px' }}
                >
                ❌ Supprimer
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MessagePage;