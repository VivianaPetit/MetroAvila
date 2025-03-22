import React, { useEffect, useState } from "react";
import profileIcon from "../assets/user-icon.svg";
import StatCard from "./StatCard";
import { useUser } from "../contexto/userContext.jsx";
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../credenciales";

function ProfileInfo() {
    const { user } = useUser();
    const navigate = useNavigate();
    const [reservas, setReservas] = useState([]);
    const [rutasRealizadas, setRutasRealizadas] = useState(0);
    const [horasDeActividad, setHorasDeActividad] = useState(0); // Total de horas de actividad

    useEffect(() => {
        // Verificar si el usuario está autenticado
        if (user && user.id) {
            const getUserData = async () => {
                const userRef = doc(db, "usuario", user.id);
                const userDoc = await getDoc(userRef);
                
                if (userDoc.exists()) {
                    // Si el usuario tiene una colección de reservas, obtenemos sus datos
                    const userData = userDoc.data();
                    setReservas(userData.reservas || []);
                } else {
                    console.log("Usuario no encontrado en la colección");
                }
            };

            getUserData();
        }
    }, [user, db]);

    useEffect(() => {
        if (reservas.length > 0) {
            // Contamos el número de reservas (rutas realizadas)
            setRutasRealizadas(reservas.length);

            // Sumar las horas de actividad de cada reserva
            let totalHoras = 0;

            reservas.forEach(reserva => {
                // Verifica que la reserva tenga una actividad con duración
                if (reserva.actividad && typeof reserva.actividad.duracion === 'number') {
                    totalHoras += reserva.actividad.duracion;
                }
            });

            setHorasDeActividad(totalHoras); // Guardamos el total de horas de actividad
        }
    }, [reservas]);

    return (
        <>
            {user ? (
                <>
                    <div className="overflow-hidden mb-5 rounded-full border-5 border-[#889E19] h-[120px] w-[120px]">
                        <img
                            src={user.photo || profileIcon}
                            alt="Perfil"
                            className="object-cover size-full"
                        />
                    </div>
                    <h1 className="mb-3 text-2xl font-semibold">
                        {user.name ? `${user.name} ${user.lastname || ""}` : "Usuario"}
                    </h1>

                    <p className="mb-4 text-stone-500">
                        {user.email || "Sin correo especificado"}
                    </p>

                    <p className="mb-8 text-stone-500">
                        {user.userType === "Admin"
                            ? `Administrador`
                            : user.userType === "Estudiante"
                            ? `Estudiante - ${user.carrera || "Sin carrera especificada"}`
                            : user.userType === "Guía"
                            ? `Guía - ${user.carrera || "Sin carrera especificada"}`
                            : "Visitante"}
                    </p>

                    {user.userType === "Admin" ? (
                        <div className="flex gap-5 mb-10 max-md:flex-col">
                            <button
                                onClick={() => navigate("/admin")}
                                className="px-10 py-5 text-center bg-orange-200 cursor-pointer rounded-xl max-md:w-full max-sm:p-4"
                            >
                                <h2 className="mb-1.5 text-xl">Administrar Actividades</h2>
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-5 mb-10 max-md:flex-col">
                            <StatCard title={`${rutasRealizadas}`} description="Rutas Realizadas" />
                            <StatCard title={`${horasDeActividad} hrs`} description="Horas de Actividad" />
                        </div>
                    )}
                </>
            ) : ( 
                <div className="text-xl text-center animate-pulse text-gray-600">
                    Cargando...
                </div>
            )}
        </>
    );
}

export default ProfileInfo;
