import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../credenciales'; 
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import foto from "../assets/avila.jpg"

function SearchesPage() {

  const navigate = useNavigate();
  const location = useLocation(); // Obtener el estado de la ubicación actual
  const { consulta } = location.state || { consulta: '' }; // Obtener la consulta desde el estado
  const [results, setResults] = useState(); // Para almacenar los resultados
  const [loading, setLoading] = useState(true); // Para mostrar un estado de carga mientras se buscan los resultados
  const [error, setError] = useState(null); // Para manejar errores de búsqueda

  // Función para realizar la búsqueda (solo por nombre de destino)
  const search = async (consulta) => {
    try {
      setLoading(true); 
      const searchRef = collection(db, "actividades"); 
      const q = query(
        searchRef,
        where("nombre", ">=", consulta),
        where("nombre", "<=", consulta + "\uf8ff") 
      );

      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      
      setResults(results);
    } catch (error) {
      console.error("Error en la búsqueda:", error);
      setError("Error al obtener los resultados");
    } finally {
      setLoading(false); // Finalizar el estado de carga
    }
  };

  
  useEffect(() => {
    if (consulta) {
      search(consulta);
    }
  }, [consulta]);

  if (loading) return <div className='font-semibold text-center text-[#889E19] text-2xl m-10'>Buscando...</div>; // Mensaje mientras se cargan los resultados
  if (error) return <div>{error}</div>; 

  return (
    <div>
      <Header />
      <div className="p-6 max-w-6xl mx-auto" data-aos="fade-up">
      <h1 className="text-3xl text-[#889E19] font-bold m-10">Resultados para: "{consulta}" </h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.length > 0 ? (
          results.map((result) => (
            <div 
              key={result.id} 
              onClick={() => navigate("/reservation")}
              className="bg-white cursor-pointer p-6 rounded-lg shadow-md transition-all duration-300 transform hover:shadow-xl hover:scale-105"
            >
              <img src={result.foto || foto} alt="" className='mb-3 rounded-2xl' />
              <h3 className="text-2xl font-semibold text-[#6E7D14]">{result.nombre}</h3>
              <p className="text-sm mt-2 text-gray-700">
                Haz click para más información!
              </p>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full">No se encontraron resultados.</p>
        )}
      </div>
    </div>
    <Footer />
    </div>
    
  );
}

export default SearchesPage;
