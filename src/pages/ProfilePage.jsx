import React from "react";
import { Header } from "../components/Header";
import ProfileInfo from "../components/ProfileInfo";
import PhotoGallery from "../components/PhotoGallery";
import { Footer } from "../components/Footer";
import  Button from "../components/Button.jsx";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../credenciales.js"; 
import { useNavigate } from "react-router-dom";



function ProfilePage() {

  const auth = getAuth(app);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }; 
  
  return (
    <main className="min-h-screen bg-lime-50">
      <Header />
      <section className="flex flex-col items-center px-5 py-10 max-sm:px-2.5 max-sm:py-5">
        <ProfileInfo />
        <PhotoGallery />
        <Button
          divClassName="mt-10"
          onClick={handleLogout} 
          className=" text-[#889E19] cursor-pointer font-semibold hover:text-[#6E7D14] px-4"
          text = "Cerrar sesión"

        />
      </section>
      <Footer />
    </main>
  );
}

export default ProfilePage;

