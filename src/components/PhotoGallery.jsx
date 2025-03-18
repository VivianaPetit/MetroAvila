import React, { useState, useRef, useEffect } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { storage, db } from '../credenciales'; 
import PhotoItem from "../components/PhotoItem";

function PhotoGallery() {
  const [photos, setPhotos] = useState([]); 
  const [preview, setPreview] = useState(null); 
  const fileInputRef = useRef(null); 


  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "galleryPhotos"));
        const photoList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          src: doc.data().url,
          alt: doc.data().name,
        }));
        setPhotos(photoList); 
      } catch (error) {
        console.error("Error cargando las fotos:", error);
      }
    };
    fetchPhotos();
  }, []);

  const handleAddPhoto = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result); 
      };
      reader.readAsDataURL(file);

     
      const storageRef = ref(storage, `gallery/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      
      await addDoc(collection(db, "galleryPhotos"), {
        url: downloadURL,
        name: file.name,
      });

     
      setPhotos(prevPhotos => [
        ...prevPhotos,
        { id: Date.now(), src: downloadURL, alt: file.name }
      ]);
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
        {photos.map((photo) => (
          <PhotoItem key={photo.id} src={photo.src} alt={photo.alt} />
        ))}
      </div>
    </section>
  );
}

export default PhotoGallery;