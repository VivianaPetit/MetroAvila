import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../credenciales.js";
import { doc, getDoc } from "firebase/firestore";
import { Footer } from "../components/Footer"
import { Header } from "../components/Header"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Star, Clock, Mountain, MapPin } from "lucide-react";
import L from "leaflet";
import iconRetina from "../assets/icono-mapa.png";
import iconUrl from "../assets/icono-mapa2.png";
import shadowUrl from "../assets/sombra-mapa.png";


delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
});


const DestinationDetail = () => {
  const { id } = useParams();
  const [destino, setDestino] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDestino = async () => {
      try {
        const destinoDoc = doc(db, "destinos", id);
        const destinoSnapshot = await getDoc(destinoDoc);
        if (destinoSnapshot.exists()) {
          setDestino({ id: destinoSnapshot.id, ...destinoSnapshot.data() });
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching destino: ", error);
        setError("Error al cargar el destino. Intenta nuevamente más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchDestino();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-lg font-medium">Cargando destino...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-red-600 text-lg font-semibold">{error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!destino) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-lg font-medium">Destino no encontrado</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="relative w-full h-[300px] md:h-[450px] lg:h-[550px] overflow-hidden">
        <img
          src={destino.header}
          alt={destino.nombre}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-white text-4xl md:text-6xl font-bold text-center px-4">
            {destino.nombre}
          </h1>
        </div>
      </div>

      <section className="flex-grow px-6 md:px-12 py-10 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 mb-12">
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-semibold text-[#889e19] mb-6">
              Sobre el destino
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {destino.descripcion}
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3">
                <Star className="text-yellow-500" />
                <span className="text-gray-800 font-medium">
                  Calificación: {destino.calificación} / 5
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mountain className="text-purple-600" />
                <span className="text-gray-800 font-medium">
                  Dificultad: {destino.dificultad}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="text-blue-500" />
                <span className="text-gray-800 font-medium">
                  Tiempo estimado: {destino.tiempo}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="text-red-500" />
                <span className="text-gray-800 font-medium">
                  Dirección: {destino.direccion}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center">
            <MapContainer
              center={[destino.latitud, destino.longitud]}
              zoom={13}
              style={{ height: "400px", width: "100%" }}
              className="rounded-xl shadow-lg"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[destino.latitud, destino.longitud]}>
                <Popup>{destino.nombre}</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DestinationDetail;
