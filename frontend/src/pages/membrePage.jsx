import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';

const MembrePage = () => {
  return (
    <div>
        <Header/>
        <div className='container'>
            <h1>Faire un don</h1>
        <p>Voici les membres de l'Association ❤️</p>
            
        </div>
        <Footer/>
    </div>
  );
};

export default MembrePage;
