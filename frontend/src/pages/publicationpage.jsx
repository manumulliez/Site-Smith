import React from 'react';

import Publications from '../components/Publications';
import '../styles/styles.css';
import Header from '../components/header';
import Footer from '../components/footer';

function PublicationsPage() {
  return (
    <div>
      {/* Header */}
      <Header />

      {/* Contenu */}
      <div className="container">
        <Publications />
      </div>
      <Footer/>
    </div>
  );
}

export default PublicationsPage;
