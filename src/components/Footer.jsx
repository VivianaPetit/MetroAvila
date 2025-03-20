import React from "react";
import phone from "../assets/phone-icon.svg";
import mail from "../assets/mail-icon.svg";
import location from "../assets/location-icon.svg";
import logo from "/metroavila.svg";
import { NavBar } from "./NavBar";

export const Footer = () => {
  return (
    <footer className="w-full bg-[#F2F5E5] border-t-1 border-[#49494985] p-6">
      {/* Contenedor principal */}
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-6 md:space-y-0">
        {/* Logo Section */}
        <div className="flex-shrink-0 lg:ml-20 mb-4 md:mb-0">
          <a href="/">
            <img
                className="w-[150px] md:w-[377px] h-auto object-contain"
                src={logo}
                alt="MetroÁvila Logo"
            />
          </a>
        </div>

        {/* Explore Section */} 
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h2 className="text-[#889e19] text-lg md:text-2xl font-black">EXPLORA</h2>
          <NavBar className="text-[#889e19] text-sm md:text-base font-extrabold space-y-2 mt-2" />
        </div>

        {/* Contact Section */}
        <div className="text-center ml-5 mr-5 md:text-left">
          <h2 className="text-[#889e19] text-lg md:text-2xl font-black">CONTÁCTANOS</h2>
          <ul className="text-[#889e19] text-sm md:text-base font-extrabold space-y-2 mt-2">
            <li className="flex items-center justify-center md:justify-start">
              <img
                className="w-6 h-6 mr-2"
                src={location}
                alt="Location Icon"
              />
              Universidad Metropolitana. Caracas, Venezuela
            </li>
            <li className="flex items-center justify-center md:justify-start">
              <img
                className="w-6 h-6 mr-2"
                src={phone}
                alt="Phone Icon"
              />
              +58 412 - 123 45 67
            </li>
            <li className="flex items-center justify-center md:justify-start">
              <img
                className="w-6 h-6 mr-2"
                src={mail}
                alt="Email Icon"
              />
              metroavila@correo.unimet.edu.ve
            </li>
          </ul>
        </div>
      </div>

      {/* Divider Line */}
      <hr className="w-full border-t border-[#889e19] my-4" />

      {/* Copyright Section */}
      <p className="text-center text-[#889e19] text-sm md:text-lg font-black">
        © Copyright 2025 by MetroÁvila
      </p>
    </footer>
  );
};
export default Footer;