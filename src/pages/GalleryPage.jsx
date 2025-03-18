import React, { useRef, useState, useEffect } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { storage, db, auth } from '../credenciales'; 
import { onAuthStateChanged } from 'firebase/auth'; 
import Header from '../components/Header';
import Footer from '../components/Footer';
import './GalleryPage';

const GalleryPage = () => {
  const fileInputRef = useRef(null);
  const [photos, setPhotos] = useState([]); // Estado para almacenar las fotos
  const [preview, setPreview] = useState(null); // Estado para la vista previa de la imagen
  const [uploading, setUploading] = useState(false); // Estado para indicar si se está subiendo una imagen
  const [user, setUser ] = useState(null); // Estado para almacenar el usuario autenticado

  // Verificar el estado de autenticación del usuario
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser ) => {
      setUser (currentUser );
    });
    return () => unsubscribe();
  }, []);

  // Cargar fotos existentes desde Firestore al montar el componente
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "galleryPhotos"));
        const photoList = querySnapshot.docs.map(doc => ({
          id: doc.id, 
          src: doc.data().url,
          alt: doc.data().name,
        }));
        setPhotos(photoList); // Establecer las fotos en el estado
      } catch (error) {
        console.error("Error cargando las fotos:", error);
      }
    };
    fetchPhotos();
  }, []);

  // Manejar el clic en el botón para abrir el selector de archivos
  const handleClick = () => {
    if (!user) {
      alert('Debes iniciar sesión para subir una foto.');
      return;
    }
    fileInputRef.current.click();
  };

  // Manejar el cambio de archivo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result); // Establecer la vista previa de la imagen
      };
      reader.readAsDataURL(file);
    }
  };

  // Manejar la subida de la imagen
  const handleUpload = async () => {
    if (!user) {
      alert('Debes iniciar sesión para subir una foto.');
      return;
    }

    const file = fileInputRef.current.files[0];
    if (!file) return;

    setUploading(true); // Indicar que se está subiendo una imagen

    try {
      const storageRef = ref(storage, `gallery/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, file); // Subir la imagen a Firebase Storage
      const downloadURL = await getDownloadURL(storageRef); // Obtener la URL de descarga

      // Guardar la URL en Firestore
      await addDoc(collection(db, "galleryPhotos"), {
        url: downloadURL,
        name: file.name,
      });

      // Actualizar el estado de las fotos
      setPhotos(prevPhotos => [
        ...prevPhotos,
        { id: Date.now(), src: downloadURL, alt: file.name } 
      ]);

      // Limpiar estados
      setPreview(null);
      fileInputRef.current.value = null;
      alert('¡Imagen subida con éxito!');
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      alert('Error al subir la imagen');
    } finally {
      setUploading(false); // Indicar que la subida ha terminado
    }
  };

  return (
    <div className="gallery-page bg-[#F2F5E5] min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow p-8">
        <header className="gallery-header mb-6">
          <h1 className="text-3xl text-[#889e19] font-bold text-left">GALERÍA</h1>
        </header>

        <div
          className="flex items-center justify-center bg-[#d9e4b1] rounded-lg shadow-md cursor-pointer hover:bg-[#c8d49a] transition-colors py-[1rem] w-[24rem] my-[1rem]"
          onClick={handleClick}
        >
          <span className="text-[#889e19] text-xl font-bold">
            + &nbsp; Agrega tu foto!
          </span>
        </div>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }} 
        />

        {preview && (
          <div className="flex flex-col items-center my-4">
            <img src={preview} alt="Preview" className="w-64 h-64 object-cover rounded-lg shadow-md mb-4" />
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="bg-[#889e19] text-white px-6 py-2 rounded-lg shadow-md hover:bg-[#728115] transition-colors"
            >
              {uploading ? 'Subiendo...' : 'Subir Imagen'}
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group">
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
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GalleryPage;