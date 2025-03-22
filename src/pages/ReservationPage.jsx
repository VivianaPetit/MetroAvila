import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import BookingCalendar from '../components/BookingCalendar';
import { auth } from '../credenciales'; 
import PaypalButton from "../components/PaypalButton";
import { useNavigate } from 'react-router-dom';

function ReservationPage() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setIsAuthenticated(!!user);
    }, error => {
      console.error('Error during authentication:', error);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className='bg-[#F2F5E5] min-h-screen'>
      <Header />

      <main className="p-8">
        <h1 className='text-3xl text-[#889e19] font-bold mb-8' data-aos="fade-up" data-aos-once="true">
          Reservas
        </h1>
        
        <BookingCalendar />
        
        <div className="mt-8 flex flex-col items-center justify-center px-6 py-8 bg-[#e9f0d5] rounded-lg shadow-xl max-w-xl mx-auto">
          <h2 className='text-3xl text-[#889e19] font-extrabold mb-5 text-center leading-tight'>
            ¡Tu apoyo hace la diferencia!
          </h2>
          <p className='text-lg text-[#4a4a4a] mb-6 text-center'>
            Gracias a tu contribución, podemos seguir mejorando y ofreciendo experiencias inolvidables. ¡Tu generosidad marca la diferencia!
          </p>
          <div className='w-full flex justify-center'>
            <PaypalButton />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ReservationPage;

