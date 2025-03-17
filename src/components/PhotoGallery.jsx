import React from "react";
import photo from "/humboldt.png";
import PhotoItem from "../components/PhotoItem";
import { useUser } from "../contexto/userContext.jsx"; 

function PhotoGallery({ photos }) {

  const handleAddPhoto = () => {
    // This would be implemented to add a new photo
    console.log("Add photo clicked");
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
      <div className="grid gap-5 grid-cols-[repeat(3,1fr)] max-md:grid-cols-[repeat(2,1fr)] max-sm:grid-cols-[1fr]">
        {photos.map((photo, index) => (
          <PhotoItem key={index} src={photo.src} alt={photo.alt} />
        ))}
      </div>
    </section>
  );
}

export default PhotoGallery;