import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../credenciales.js";
import { doc, getDoc } from "firebase/firestore";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer"
import { Star, Clock, Mountain } from "lucide-react";

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

            {/* Header Image */}
            <div className="relative w-full h-[300px] md:h-[450px] lg:h-[550px] overflow-hidden">
                <img
                    src={destino.header}
                    alt={destino.nombre}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <h1 className="text-white text-4xl md:text-6xl font-bold">{destino.nombre}</h1>
                </div>
            </div>

            {/* Destination Content */}
            <section className="flex-grow px-6 md:px-12 py-10 max-w-6xl mx-auto">
                {/* Details */}
                <div className="grid md:grid-cols-2 gap-10 mb-12">
                    <div className="flex flex-col justify-center">
                        <h2 className="text-3xl font-semibold text-lime-600 mb-6">Sobre el destino</h2>
                        <p className="text-lg text-gray-700 leading-relaxed">{destino.descripcion}</p>

                        {/* Info Row */}
                        <div className="mt-8 space-y-4">
                            <div className="flex items-center gap-3">
                                <Star className="text-yellow-500" />
                                <span className="text-gray-800 font-medium">Calificación: {destino.calificacion} / 5</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mountain className="text-purple-600" />
                                <span className="text-gray-800 font-medium">Dificultad: {destino.dificultad}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Clock className="text-blue-500" />
                                <span className="text-gray-800 font-medium">Tiempo estimado: {destino.tiempo}</span>
                            </div>
                        </div>
                    </div>

                    {/* Image (optional - you can show header or another image if you want) */}
                    <div className="flex justify-center items-center">
                        <img
                            src={destino.header}
                            alt={destino.nombre}
                            className="rounded-xl shadow-lg w-full h-auto object-cover max-h-[400px]"
                        />
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default DestinationDetail;
