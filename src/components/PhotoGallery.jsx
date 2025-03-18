import React, { useState, useRef } from "react";
import photo from "/humboldt.png"; 
import PhotoItem from "../components/PhotoItem";

function PhotoGallery() {
  const [photos, setPhotos] = useState([photo]); 
  const [preview, setPreview] = useState(null); 
  const fileInputRef = useRef(null); 

  const handleAddPhoto = () => {
    
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        
        setPreview(reader.result);
        setPhotos((prevPhotos) => [...prevPhotos, reader.result]);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="mx-auto my-0 w-full max-w-[1000px]">
      <div className="flex items-center mb-5">
        <h2 className="mr-2.5 text-lg font-medium">Fotos</h2>
        <span className="mr-auto text-stone-500"> {photos.length} </span>
        <button
          onClick={handleAddPhoto}
          className="flex items-center justify-center text-xl bg-[#889E19] rounded-full cursor-pointer h-[30px] text-white w-[30px]"
          aria-label="Add photo"
        >
          +
        </button>
      </div>

     
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }} 
      />

     
      {preview && (
        <div className="mb-4">
          <img src={preview} alt="Preview" className="w-full h-auto rounded-lg" />
        </div>
      )}

      <div className="grid gap-5 grid-cols-[repeat(3,1fr)] max-md:grid-cols-[repeat(2,1fr)] max-sm:grid-cols-[1fr]">
        {photos.map((src, index) => (
          <PhotoItem key={index} src={src} alt={`Photo ${index + 1}`} />
        ))}
      </div>
    </section>
  );
}

export default PhotoGallery;