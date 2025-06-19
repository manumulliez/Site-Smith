import React, { useEffect} from 'react';
import {  useNavigate } from 'react-router-dom';
import HeaderAdmin from '../../components/headerAdmin';

function AdminPage() {
  const navigate = useNavigate();


  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    console.log(isAdmin);
    if (isAdmin === "false" ) {
      navigate('/login');
      console.log('retour');
    }

  })

  return (
    <div>
      <HeaderAdmin />

      <div className="container">
        <h2>Bienvenue, administrateur 👋</h2>
      </div>
        
    </div>
  );
}

export default AdminPage;
