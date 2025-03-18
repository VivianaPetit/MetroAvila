import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import BookingCalendar from '../components/BookingCalendar';
import { auth } from '../credenciales'; 
import PaypalButton from "../components/PaypalButton";


function ReservationPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setIsAuthenticated(!!user);
    }, error => {
      console.error('Error during authentication:', error);
    });

    return () => unsubscribe();
  }, []);

  const handlePayPalClick = () => {
    if (isAuthenticated) {
      window.location.href = 'https://www.paypal.com/donate?hosted_button_id=YOUR_BUTTON_ID';
    } else {
      alert('Por favor, inicie sesión para realizar una contribución.');
    }
  };

  return (
    <div className='bg-[#F2F5E5] min-h-screen'>
      <Header />

    <main className="p-8">
        <h1 className='text-3xl text-[#889e19] font-bold mb-6' data-aos="fade-up" data-aos-once="true">
            Reservar
        </h1>
        <BookingCalendar/>
        <div className="mt-5 place-items-center">
          <PaypalButton />
        </div>
    </main>

      <Footer />
    </div>
  );
}

export default ReservationPage
