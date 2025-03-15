import React from "react";
import { Link } from "react-router-dom";

export const Destination = ({ destino }) => {
    return (
        <Link to={`/destino/${destino.id}`} >
            <div className="bg-white shadow-md cursor-pointer rounded p-4">
                <img src={destino.foto} alt={destino.nombre} className="w-full h-32 object-cover rounded" />
                <h2 className="text-lg font-semibold mt-2">{destino.nombre}</h2>
                <p className="text-sm text-gray-600">Calificación: {destino.calificacion}</p>
                <p className="text-sm text-gray-600">Dificultad: {destino.dificultad}</p>
                <p className="text-sm text-gray-600">Tiempo estimado: {destino.tiempo}</p>
            </div>
        </Link>
    );
};


