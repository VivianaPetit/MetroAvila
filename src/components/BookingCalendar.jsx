import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { motion } from "framer-motion";
import { db } from "../credenciales";
import { collection, getDocs, doc, setDoc, getDoc, addDoc, updateDoc, arrayUnion } from "firebase/firestore";
import Button from "./Button";
import { useUser } from "../contexto/userContext";
import { useNavigate } from "react-router-dom";

const BookingCalendar = () => {
    const [date, setDate] = useState(new Date());
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [destinos, setDestinos] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        fetchActivity(date);
    }, [date]);

    const fetchActivity = async (selectedDate) => {
        setLoading(true);
        const formattedDate = selectedDate.toISOString().split("T")[0];

        try {
            const querySnapshot = await getDocs(collection(db, "actividades"));
            const selectedActivities = querySnapshot.docs
                .map(doc2 => ({ id: doc2.id, ...doc2.data() }))
                .filter(activity => {
                    const activityDate = activity.fecha.toDate().toISOString().split("T")[0];
                    return activityDate === formattedDate;
                });

            setActivities(selectedActivities);
        } catch (error) {
            console.error("Error obteniendo actividades:", error);
            setActivities([]);
        }
        setLoading(false);
    };

    const handleReservar = async (activity) => {
        if (!user) {
            setTimeout(() => {
                navigate("/login");
            }, 1000);
            return;
        }

        if (!activity.disponible || activity.cupos === 0) {
            setMessage("No hay cupos disponibles para esta actividad.");
            return;
        }

        setIsLoading(true);
        try {
            const activityRef = doc(db, "actividades", activity.id);
            await setDoc(activityRef, { cupos: activity.cupos - 1 }, { merge: true });

            await registrarReserva(activity);

            setActivities(prevActivities =>
                prevActivities.map(act => 
                    act.id === activity.id ? { ...act, cupos: act.cupos - 1 } : act
                )
            );

            setMessage("¡Reserva realizada con éxito!");
        } catch (error) {
            console.error("Error al reservar:", error);
            setMessage("Error al realizar la reserva.");
        }
        setIsLoading(false);
    };

    const registrarReserva = async (activity) => {
        try {
            
            if (!user || !user.uid) {
                console.error("Usuario no autenticado.");
                return;
            }
    
            // Datos de la reserva
            const reservationData = {
                usuarioId: user.uid,
                actividadId: activity.id,
                nombreActividad: activity.nombre,
                fechaReserva: new Date().toISOString().split("T")[0],
                fechaActividad: activity.fecha?.toDate().toISOString().split("T")[0] || null, 
                destino: activity.destino,
            };
    
            // Verificar si el usuario ya tiene un documento en la colección "usuarios"
            const userRef = doc(db, "usuarios", user.uid);
            const userDoc = await getDoc(userRef);
    
            // Si el documento del usuario no existe, crearlo con el campo 'reservas' vacío
            if (!userDoc.exists()) {
                await setDoc(userRef, { reservas: [reservationData] }); // Crear con la primera reserva
                console.log("Documento de usuario creado con la primera reserva.");
            } else {
                // Si el documento ya existe, agregar la reserva al campo "reservas"
                await setDoc(userRef, {
                    reservas: arrayUnion({
                        reservaId: docRef.id,
                        ...reservationData,
                    })
                }, { merge: true });
    
                console.log("Reserva agregada al documento de usuario.");
            }
    
            // Guardar la reserva en la colección "reservas"
            const docRef = await addDoc(collection(db, "reservas"), reservationData);
            console.log("Reserva registrada con éxito:", reservationData);
    
        } catch (error) {
            console.error("Error al registrar la reserva:", error);
        }
    };

    useEffect(() => {
        const obtenerNombreDestino = async () => {
            if (activities.length === 0) return;

            const nuevosDestinos = {};
            for (const activity of activities) {
                if (!activity?.destino) continue;

                const destinoDoc = await getDoc(activity.destino);
                if (destinoDoc.exists()) {
                    nuevosDestinos[activity.id] = destinoDoc.data().nombre;
                }
            }
            setDestinos(nuevosDestinos);
        };
        obtenerNombreDestino();
    }, [activities]);

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4 text-center">Calendario de Actividades</h2>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Calendar onChange={setDate} value={date} className="mx-auto rounded-2xl" />
            </motion.div>
            <div className="text-center mt-4">
                <p className="text-lg">Fecha seleccionada: <span className="text-[#889e19] font-black">{date.toDateString()}</span></p>
                {message && <p className="mt-2 text-green-600 font-bold">{message}</p>}

                {loading ? (
                    <p className="text-center m-2 text-[16px] text-gray-800 font-semibold animate-pulse">Cargando actividades...</p>
                ) : activities.length > 0 ? (
                    activities.map((activity) => (
                        <motion.div 
                            key={activity.id} 
                            className="mt-4 p-6 bg-[#C5D098] rounded-3xl shadow-xl"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h3 className="text-xl font-bold text-gray-800">{activity.nombre}</h3>
                            <p className="italic text-gray-600">{activity.descripcion}</p>
                            <p><strong>Destino:</strong> {destinos[activity.id] || "Cargando destino..."}</p>
                            <p><strong>Dificultad:</strong> {activity.dificultad}</p>
                            <p><strong>Duración:</strong> {activity.duracion} horas</p>
                            <p><strong>Cupos disponibles:</strong> {activity.cupos}</p>
                            <p><strong>Equipo requerido:</strong> {activity.requiereEquipo ? "Sí" : "No"}</p>
                            <p><strong>Permisos requeridos:</strong> {activity.requierePermisos ? "Sí" : "No"}</p>

                            <Button
                                onClick={() => handleReservar(activity)}
                                text={isLoading ? "Reservando..." : "Reservar"}
                                disabled={isLoading || !activity.disponible || activity.cupos === 0}
                                className={`mt-4 px-6 py-2 font-bold rounded-2xl transition-all duration-300 
                                    ${isLoading ? "bg-gray-400 cursor-not-allowed text-gray-700" : activity.cupos === 0 ? "bg-gray-400 cursor-not-allowed text-gray-700" : "bg-[#889e19] hover:bg-[#6E7D14] cursor-pointer text-white"}
                                `}
                            />
                                
                            
                        </motion.div>
                    ))
                ) : (
                    <p className="text-red-500">No hay actividades programadas para esta fecha.</p>
                )}
            </div>
        </div>
    );
};

export default BookingCalendar;
