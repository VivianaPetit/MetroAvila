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
        <label htmlFor="destination" className="block text-lg font-medium text-gray-700 mb-2">
            ¿A qué destino deseas ir?
          </label>
          <select id="destination" name="destination" className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#889e19] focus:border-[#889e19]">
            <option value="">Selecciona una opción</option>
            <option value="destino1">Destino 1</option>
            <option value="destino2">Destino 2</option>
            <option value="destino3">Destino 3</option>
          </select>
        </div>
        <div className="mt-6">
          <button 
          className="bg-[#ffc439] text-[#003087] font-bold py-2 px-4 rounded flex items-center"
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
