import React from 'react';
import PhotoGallery from '../components/PhotoGallery';
import './GalleryPage';

const GalleryPage = () => {
  const photos = [
    { src: 'path/to/photo1.jpg', alt: 'Photo 1' },
    { src: 'path/to/photo2.jpg', alt: 'Photo 2' },
    { src: 'path/to/photo3.jpg', alt: 'Photo 3' },
    // Agrega más fotos según sea necesario
  ];

  return (
    <div className="gallery-page p-8 bg-[#F2F5E5] min-h-screen">
      <header className="gallery-header text-center mb-6">
        <h1 className="text-3xl text-[#889e19] font-bold">GALERÍA</h1>
      </header>
      <PhotoGallery photos={photos} />
    </div>
  );
};

export default GalleryPage;