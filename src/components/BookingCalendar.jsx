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
    const [markedDates, setMarkedDates] = useState(new Set());
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [destinos, setDestinos] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        fetchActivity(date);
    }, [date]);

    useEffect(() => {
        fetchMarkedDates();
    }, []);

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

    const fetchMarkedDates = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "actividades"));
            const datesSet = new Set();
            querySnapshot.docs.forEach(doc2 => {
                const activityDate = doc2.data().fecha.toDate().toISOString().split("T")[0];
                datesSet.add(activityDate);
            });
            setMarkedDates(datesSet);
        } catch (error) {
            console.error("Error obteniendo fechas de actividades:", error);
        }
    };

    const handleReservar = async (activity) => {
        console.log(activity.cupos);
        if (!user) {
            setTimeout(() => {
                navigate("/login");
            }, 1000);
            return;
        }

        if (!activity.disponible || activity.cupos === 0) {
            
            setMessage("No hay cupos disponibles para esta actividad.");
            setTimeout(() => setMessage(""), 5000);
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
            setTimeout(() => setMessage(""), 5000);
        } catch (error) {
            setMessage("Error al realizar la reserva.");
            setTimeout(() => setMessage(""), 5000);
        }
        setIsLoading(false);
    };

    

const registrarReserva = async (activity) => {
    try {
        

        const reservationData = {
            usuario: user,
            actividad: activity,
            nombreActividad: activity.nombre,
            fecha: new Date(),
            fechaActividad: activity.fecha || null, 
            destino: activity.destino,
        };

        const userRef = doc(db, "usuario", user.id);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            // Si el usuario no existe, crea el documento con el array de reservas
            await setDoc(userRef, { reservas: [reservationData] });
        } else {
            // Si el usuario existe, usa updateDoc en lugar de setDoc
            await updateDoc(userRef, {
                reservas: arrayUnion(reservationData) // Usa updateDoc con arrayUnion
            });
        }

        // Guardar la reserva en la colección general de reservas
        await addDoc(collection(db, "reservas"), reservationData);

        navigate("/confirmation");
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
                <Calendar
                    onChange={setDate}
                    value={date}
                    className="mx-auto rounded-2xl"
                    tileClassName={({ date }) => 
                        markedDates.has(date.toISOString().split("T")[0]) ? "highlighted-day" : ""
                    }
                />
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
                            <p><strong>Destino:</strong> {destinos[activity.id] || "Cargando..."}</p>
                            <p><strong>Dificultad:</strong> {activity.dificultad}</p>
                            <p><strong>Duración:</strong> {activity.duracion} horas</p>
                            <p><strong>Cupos disponibles:</strong> {activity.cupos}</p>
                            
                            <Button
                                onClick={() => handleReservar(activity)}
                                text={isLoading ? "Reservando..." : "Reservar"}
                                disabled = {isLoading || !activity.disponible || activity.cupos === 0}
                                className="mt-4 px-6 py-2 font-bold rounded-2xl bg-[#889e19] hover:bg-[#6E7D14] text-white"
                            />
                        </motion.div>
                    ))
                ) : (
                    <p className="text-red-500">No hay actividades programadas para esta fecha.</p>
                )}
            </div>

            <style>
                {`.highlighted-day { background-color: #889e19 !important; color: white !important; }`}
            </style>
        </div>
    );
};

export default BookingCalendar;
