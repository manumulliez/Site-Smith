import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';

const Donation = () => {
  return (
    <div>
        <Header/>
        <div className='container'>
            <h1>Faire un don</h1>
        <p>Merci de soutenir notre association ❤️</p>
        <form action="https://www.paypal.com/donate" method="post" target="_blank">
            <input type="hidden" name="business" value="ton-email-paypal@example.com" />
            <input type="hidden" name="no_recurring" value="0" />
            <input type="hidden" name="item_name" value="Soutenir notre association" />
            <input type="hidden" name="currency_code" value="EUR" />
            <button type="submit">Faire un don via PayPal</button>
        </form>
        </div>
        <Footer/>
    </div>
  );
};

export default Donation;
