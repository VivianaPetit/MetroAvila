import React from "react";

const InfoSection = () => {
    return (
        <section className="bg-[#d7dfb7] text-[#333] py-10 px-6 rounded-xl shadow-lg">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-[#889e19]">Explora, Aprende y Conéctate con la Naturaleza</h2>
                <p className="text-lg mt-2">Consejos, curiosidades y noticias sobre nuestras excursiones en el Parque Nacional El Ávila.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition">
                    <h3 className="text-xl font-semibold text-[#6E7D14]">Consejos para una Excursión Segura</h3>
                    <ul className="list-disc list-inside text-sm mt-2 text-gray-700">
                        <li>Siempre lleva suficiente agua y snacks energéticos.</li>
                        <li>Usa ropa y calzado adecuados para el senderismo.</li>
                        <li>Respeta la naturaleza, no dejes basura y sigue los senderos marcados.</li>
                        <li>Consulta el clima antes de salir y evita días de lluvia intensa.</li>
                    </ul>
                </div>

                
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition">
                    <h3 className="text-xl font-semibold text-[#6E7D14]">Curiosidades del Parque Nacional El Ávila</h3>
                    <p className="text-sm mt-2 text-gray-700">
                        ¿Sabías que el Ávila es hogar de más de 500 especies de flora y fauna? Entre ellas, el emblemático cardenalito, una pequeña ave roja en peligro de extinción. 
                        Explorar sus senderos es una oportunidad única para conectarte con la biodiversidad de Venezuela.
                    </p>
                </div>

                
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition">
                    <h3 className="text-xl font-semibold text-[#6E7D14]">Últimas Noticias</h3>
                    <p className="text-sm mt-2 text-gray-700">
                        📢 ¡Nuevas rutas disponibles! Nos complace anunciar la apertura de dos nuevas excursiones guiadas a 
                        la Cascada de Chorro Grande y el Camino de los Españoles. Reserva tu cupo y vive la aventura.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default InfoSection;
