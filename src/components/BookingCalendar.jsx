import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { db } from "../credenciales"; 
import { collection, getDocs, doc, setDoc, getDoc } from "firebase/firestore";
import Button from "./Button";
import { useUser } from "../contexto/userContext";
import { useNavigate } from "react-router-dom";


const BookingCalendar = () => {
    const [date, setDate] = useState(new Date());
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [destinos, setDestinos] = useState({}); 
    const { user } = useUser(); // info del usuario autenticado
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

    const handleReservar = (activityId, currentCupos) => {
        if (user) {
          {handleBooking(activityId, currentCupos)}
        } else {
            navigate("/login");
        }
      };

    const handleBooking = async (activityId, currentCupos) => {
      if (currentCupos > 0) {
          try {
              const activityRef = doc(db, "actividades", activityId);
              await setDoc(activityRef, { cupos: currentCupos - 1 }, { merge: true });

              setActivities(prevActivities =>
                  prevActivities.map(act => 
                      act.id === activityId ? { ...act, cupos: act.cupos - 1 } : act
                  )
              );



              setMessage("¡Reserva realizada con éxito!");
          } catch (error) {
              console.error("Error al reservar:", error);
              setMessage("Error al realizar la reserva.");
          }
      } else {
          setMessage("La actividad", activityRef.nombre, "No tiene cupos disponibles.");
      }
  };


  useEffect(() => {
      const obtenerNombreDestino = async () => {
          if (!activities || activities.length === 0) return; // Verifica que el array no esté vacío
          
          try {
              // Itera sobre todas las actividades
              for (const activity of activities) {
                  if (!activity?.destino) continue; // Verifica que cada actividad tenga un destino
                  
                  const destinoDoc = await getDoc(activity.destino); // Obtiene el documento
                  if (destinoDoc.exists()) {
                      setDestinos(prev => ({ 
                          ...prev, 
                          [activity.id]: destinoDoc.data().nombre 
                      })); // Guarda el nombre del destino para esta actividad
                  } else {
                      setMessage("Destino no encontrado");
                  }
              }
          } catch (error) {
              console.log("Error obteniendo el destino:", error);
          }
      };
      obtenerNombreDestino();
  }, [activities]); // El hook se activa cuando cambia el array 'activities'
  
  

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4 text-center">Calendario de Actividades</h2>

            <Calendar onChange={setDate} value={date} className="mx-auto rounded-2xl" />

            <div className="text-center mt-4">
                <p className="text-lg">Fecha seleccionada: <span className="text-[#889e19] font-black">{date.toDateString()}</span></p>
                {message && <p className="mt-2 text-green-600 font-bold">{message}</p>}

                {loading ? (
                    <p className="text-center m-2 text-[16px] text-gray-800 font-semibold animate-pulse">
                        Cargando actividades...
                    </p>
                ) : activities.length > 0 ? (
                    activities.map((activity) => (
                        <div key={activity.id} className="mt-4 text-center w-[auto] text-[#333] p-4 bg-[#C5D098] rounded-3xl shadow-xl">
                            <h3 className="text-xl font-bold">{activity.nombre}</h3>
                            <p className="italic">{activity.descripcion}</p>
                            <p> <strong>Destino:</strong> {destinos[activity.id] ? destinos[activity.id] : "Cargando destino..."} </p>
                            <p><strong>Dificultad:</strong> {activity.dificultad}</p>
                            <p><strong>Duración:</strong> {activity.duracion} horas</p>
                            <p><strong>Cupos disponibles:</strong> {activity.cupos}</p>
                            <p><strong>Equipo requerido:</strong> {activity.requiereEquipo ? "Sí" : "No"}</p>
                            <p><strong>Permisos requeridos:</strong> {activity.requierePermisos ? "Sí" : "No"}</p>

                            <Button
                                onClick={() => handleReservar(activity.id, activity.cupos)}
                                disabled={!activity.disponible || activity.cupos === 0}
                                className={`mt-4 px-6 py-2 font-bold rounded-2xl
                                    ${activity.cupos === 0 ? "bg-gray-400 cursor-not-allowed text-gray-700" : "bg-[#889e19] hover:bg-[#6E7D14] cursor-pointer text-white"}
                                `}
                                text="Reservar"
                            />
                        </div>
                    ))
                ) : (
                    <p className="text-red-500">No hay actividades programadas para esta fecha.</p>
                )}
            </div>
        </div>
    );
};

export default BookingCalendar;


