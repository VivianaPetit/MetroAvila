import React from 'react'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import BookingCalendar from '../components/BookingCalendar'

function ReservationPage() {
  
  const handlePayPalClick = () => {
    window.location.href = 'https://www.paypal.com/donate?hosted_button_id=YOUR_BUTTON_ID';
  }
  return (
    <div className='bg-[#F2F5E5] min-h-screen'>
      <Header />

    <main className="p-8">
        <h1 className='text-3xl text-[#889e19] font-bold mb-6" data-aos="fade-up" data-aos-once="true'>
            Reservar
        </h1>
        <BookingCalendar/>
        <div className="mt-6">
        </div>
        <div className="mt-6">
          <button 
          className="bg-[#ffc439] text-[#003087] font-bold py-2 px-4 rounded flex items-center cursor-pointer"
            onClick={handlePayPalClick}
            >
            <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg" alt="PayPal" className="h-6 mr-2"/>
            Contribución
          </button>
        </div>
    </main>

      <Footer />
    </div>
  )
}

export default ReservationPage
