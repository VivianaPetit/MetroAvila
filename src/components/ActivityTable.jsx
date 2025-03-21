import React, { useEffect, useState } from "react";
import ActivityEditor from "./ActivityEditor.jsx";
import { getFirestore, collection, doc, deleteDoc, updateDoc, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { app } from "../credenciales";
import editIcon from '../assets/edit.png';


const ActivityTable = () => {
    const [activities, setActivities] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const db = getFirestore(app);

    useEffect(() => {
        const activitiesCollection = collection(db, "actividades");
        const unsubscribe = onSnapshot(activitiesCollection, (snapshot) => {
            const activitiesList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            setActivities(activitiesList);
        });

        return () => unsubscribe();
    }, [db]);

    const handleEdit = (activity) => {
        setSelectedActivity(activity);
    };

    const handleSave = async (activity) => {
        const activityRef = doc(db, "actividades", activity.id);
        try {
            console.log("Save")
            console.log(activity.nombre)
            console.log(activity.guia)
            await updateDoc(activityRef, {

                nombre: activity.nombre,
                descripcion: activity.descripcion,
                guia: activity.guia,
                nombreGuia: activity.nombreGuia,
                destino: activity.destino,
                fecha: activity.fecha,
                dificultad: activity.dificultad,
                requierePermisos: activity.requierePermisos,
                requiereEquipo: activity.requiereEquipo,
                tipoActividad: activity.tipoActividad,
                duracion: activity.duracion,
                cupos: activity.cupos,
                disponible: activity.disponible,

            });
            setSelectedActivity(null);
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    };

    const handleDelete = async (activity) => {
        const activityRef = doc(db, "actividades", activity.id);
        try {
            await deleteDoc(activityRef);
            console.log("Document successfully deleted!");
            setSelectedActivity(null);
        } catch (e) {
            console.error("Error deleting document: ", e);
        }


    };

    const createEmptyActivityDocument = async () => {
        const activitiesCollection = collection(db, "actividades");

        const newActivity = {
            nombre: "Nueva actividad",
            descripcion: "",
            guia: "",
            destino: "",
            nombreGuia: "",
            fecha: serverTimestamp(),
            dificultad: "",
            requierePermisos: false,
            requiereEquipo: false,
            tipoActividad: "",
            duracion: 0,
            cupos: 0,
            disponible: 0
        };

        try {
            await addDoc(activitiesCollection, newActivity);
        } catch (e) {
            console.error("Error adding document: ", e);
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

                {activities.map((activity) => (
                    <div
                        key={activity.id}
                        className="grid p-2 border-b border-solid border-b-lime-600 grid-cols-[1fr_1fr_50px] text-sm"
                    >
                        <p className="text-black">{activity.nombre}</p>
                        <p className="text-black">{activity.nombreGuia}</p>
                        <button
                            className="text-black"
                            onClick={() => handleEdit(activity)}
                            aria-label={`Edit ${activity.nombre}`}
                        >
                            <img
                                className="h-4 w-4"
                                src={editIcon}
                                alt="edit"
                            />
                        </button>
                    </div>
                ))}


            </section>
            <button onClick={createEmptyActivityDocument} className="mt-4 px-6 py-3 bg-[#889e19] text-white text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                Agregar actividad
            </button>

            {selectedActivity && (
                <ActivityEditor
                    isOpen={true}
                    onClose={() => setSelectedActivity(null)}
                    onSave={handleSave}
                    onDelete={handleDelete}
                    initialActivity={selectedActivity}
                />
            )}

        </>
    );
};

export default ActivityTable;
