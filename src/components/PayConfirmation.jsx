import React from "react";
import checkmarkIcon  from "../assets/checkmark.svg";
import Header from "./Header";
import Footer from "./Footer";
import AOS from 'aos';
import 'aos/dist/aos.css';

function PayConfirmation() {
  return (
    <div className="flex flex-col mx-auto max-w-none min-h-screen bg-lime-50 max-md:max-w-[991px] max-sm:max-w-screen-sm"
        data-aos="fade-up">
        <Header/>
        <main className="flex flex-col flex-1 items-center px-0 py-12">
            <h1 className="mb-10 text-6xl text-center font-black text-lime-600 max-md:px-5 max-md:py-0 max-md:text-5xl max-sm:text-4xl">
                <span>GRACIAS POR RESERVAR CON</span>
                <br />
                <span className="text-orange-500">METROÁVILA</span>
                <span>!</span>
            </h1>
            <div>
                <img src={checkmarkIcon} alt="check" />
            </div>
        </main>
        <Footer/>
    </div>
    
  );
}

export default PayConfirmation;
