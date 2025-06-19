import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/homepage';
import ContactPage from './pages/contactPage';
import LoginPage from './pages/loginPage';
import PublicationsPage from './pages/publicationpage';

import AdminDashboard from './pages/Admin/adminPage';
import AjouterPublicationPage from './pages/Admin/AjouterPublicationPage';
import GestionAdmins from './pages/Admin/gestionAdminPage';
import GestionPublication from './pages/Admin/gestionPublicationPage';
import ModifierPublication from './pages/Admin/modifierPublication';
import GestionContenu from './pages/Admin/gestionContenu';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/publications" element={<PublicationsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/contact" element={<ContactPage />} />


        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/gestion-contenu" element={<GestionContenu />} />
        <Route path="/gestion-admin" element={<GestionAdmins />} />

        <Route path="/gestion-publications" element={  <GestionPublication /> } />
        <Route path="/ajouter-publication" element={<AjouterPublicationPage />} />
        <Route path='/modifier-publication/:id' element={<ModifierPublication/>}/>
      </Routes>
    </Router>
  );
}

export default App;