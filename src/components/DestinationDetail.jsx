// DestinationDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../credenciales.js"; 
import { doc, getDoc } from "firebase/firestore";

const DestinationDetail = () => {
    const { id } = useParams(); 
    const [destino, setDestino] = useState(null);
    const [loading, setLoading] = useState(true);

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
            } finally {
                setLoading(false);
            }
        };

        fetchDestino();
    }, [id]);

    if (loading) {
        return <p>Cargando destino...</p>;
    }

    if (!destino) {
        return <p>Destino no encontrado</p>;
    }

    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold">{destino.nombre}</h1>
            <img src={destino.foto} alt={destino.nombre} className="w-full h-64 object-cover rounded" />
            <p className="mt-4">Calificación: {destino.calificacion}</p>
            <p>Dificultad: {destino.dificultad}</p>
            <p>Tiempo estimado: {destino.tiempo}</p>
            <p>{destino.descripcion}</p> 
        </div>
    );
};

export default DestinationDetail;