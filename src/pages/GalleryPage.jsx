import React from 'react';
import PhotoGallery from '../components/PhotoGallery';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './GalleryPage';

const GalleryPage = () => {
  const photos = [
    { src: 'path/to/photo1.jpg', alt: 'Photo 1' },
    { src: 'path/to/photo2.jpg', alt: 'Photo 2' },
    { src: 'path/to/photo3.jpg', alt: 'Photo 3' },
    // Agrega más fotos según sea necesario
  ];

  return (
    <div className="gallery-page bg-[#F2F5E5] min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow p-8">
        <header className="gallery-header text-center mb-6">
          <h1 className="text-3xl text-[#889e19] font-bold">GALERÍA</h1>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo, index) => (
            <div key={index} className="relative group">
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover rounded-lg shadow-md transition-transform transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white text-lg">{photo.alt}</span>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-center bg-[#d9e4b1] rounded-lg shadow-md cursor-pointer hover:bg-[#c8d49a] transition-colors">
            <span className="text-[#889e19] text-xl font-bold">+<br />Agrega tu foto!</span>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GalleryPage;