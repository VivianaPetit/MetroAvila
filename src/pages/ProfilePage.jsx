import React from "react";
import { Header } from "../components/Header";
import ProfileInfo from "../components/ProfileInfo";
import PhotoGallery from "../components/PhotoGallery";
import { Footer } from "../components/Footer";

function ProfilePage() {
  return (
    <main className="min-h-screen bg-lime-50">
      <Header />
      <section className="flex flex-col items-center px-5 py-10 max-sm:px-2.5 max-sm:py-5">
        <ProfileInfo />
        <PhotoGallery />
      </section>
      <Footer />
    </main>
  );
}

export default ProfilePage;

