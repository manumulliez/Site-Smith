import React from 'react';

import Publications from '../components/Publications';
import '../styles/styles.css';
import Header from '../components/header';

function PublicationsPage() {
  return (
    <div>
      {/* Header */}
      <Header />

      {/* Contenu */}
      <div className="container">
        <Publications />
      </div>
    </div>
  );
}

export default PublicationsPage;
