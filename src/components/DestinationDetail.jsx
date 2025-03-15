import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../credenciales.js"; 
import { doc, getDoc } from "firebase/firestore";

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
        return <p>Cargando destino...</p>;
    }

    if (error) {
        return <p className="text-red-600 font-semibold">{error}</p>; 
    }

    if (!destino) {
        return <p>Destino no encontrado</p>;
    }

    return (
        <section className="self-center mt-14 w-full max-w-[1305px] max-md:mt-10 max-md:max-w-full">
            <div className="flex gap-5 max-md:flex-col">
                <article className="w-[64%] max-md:ml-0 max-md:w-full">
                    <div className="flex flex-col self-stretch my-auto max-md:mt-10 max-md:max-w-full">
                        <h1 className="self-start text-6xl font-black leading-none text-lime-600 max-md:max-w-full max-md:text-4xl">
                            {destino.header} {/* Usar el campo header */}
                        </h1>
                        <p className="mt-6 text-2xl leading-6 text-black max-md:max-w-full">
                            {destino.descripcion}
                        </p>
                    </div>
                </article>
                <aside className="ml-5 w-[36%] max-md:ml-0 max-md:w-full">
                    <img
                        src={destino.foto} 
                        alt={destino.nombre}
                        className="object-contain grow w-full rounded-xl aspect-[1.46] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] max-md:mt-10 max-md:max-w-full"
                    />
                </aside>
            </div>
        </section>
    );
};

export default DestinationDetail;