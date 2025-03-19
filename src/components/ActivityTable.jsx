import React, { useEffect, useState } from "react";
import ActivityEditor from "./ActivityEditor.jsx";
import { getFirestore, collection, doc, updateDoc, onSnapshot } from "firebase/firestore";
import { app } from "../credenciales";
import editIcon from "../assets/edit.png";
import Button from "./Button.jsx";

const ActivityTable = () => {
    const [activities, setActivities] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [loading, setLoading] = useState(true); 
    const db = getFirestore(app);

    useEffect(() => {
        setLoading(true);
        const activitiesCollection = collection(db, "actividades");
        const unsubscribe = onSnapshot(activitiesCollection, (snapshot) => {
            const activitiesList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            setActivities(activitiesList);
            setLoading(false);
        }, (error) => {
            console.error("Error obteniendo actividades:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [db]);

    const handleEdit = (activity) => {
        setSelectedActivity(activity);
    };

    const handleSave = async (activity) => {
        const activityRef = doc(db, "actividades", activity.id);
        try {
            await updateDoc(activityRef, {
                nombre: activity.nombre,
                fecha: activity.fecha,
                disponible: activity.disponible,
            });
            setSelectedActivity(null);
        } catch (error) {
            console.error("Error actualizando la actividad: ", error);
        }
    };

    return (
        <>
            <section className="p-2 rounded-lg overflow-y-auto" style={{ maxHeight: '60vh', backgroundColor: '#d7dfb7' }}>
                <div className="grid p-2 border-b border-solid border-b-lime-600 grid-cols-[1fr_1fr_50px] text-sm">
                    <h2 className="font-bold text-lime-600">Actividad</h2>
                    <h2 className="font-bold text-lime-600">Guía</h2>
                    <div></div>
                </div>

                {loading ? (
                    <p className="text-center text-md font-semibold text-gray-600 mt-4 mb-4 animate-pulse">
                        Cargando actividades...
                    </p>
                ) : (
                    activities.map((activity) => (
                        <div
                            key={activity.id}
                            className="grid p-2 border-b border-solid border-b-lime-600 grid-cols-[1fr_1fr_50px] text-sm"
                        >
                            <p className="text-black">{activity.nombre}</p>
                            <p className="text-black">{activity.nombreGuia}</p>
                            <button
                                className="text-black"
                                onClick={() => handleEdit(activity)}
                                aria-label={`Editar ${activity.nombre}`}
                            >
                                <img
                                    className="h-4 w-4"
                                    src= {editIcon}
                                    alt="Editar"
                                />
                            </button>
                        </div>
                    ))
                )}

                {selectedActivity && (
                    <ActivityEditor
                        isOpen={true}
                        onClose={() => setSelectedActivity(null)}
                        onSave={handleSave}
                        initialActivity={selectedActivity}
                    />
                )}
            </section>
            <Button 
                onClick={handleEdit} 
                text='Agregar actividad'
                className="mt-4 px-6 py-3 bg-[#889e19] text-white text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            />
                
        </>
    );
};

export default ActivityTable;
