import React, { useState, useEffect } from "react";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { app } from "../credenciales";

const db = getFirestore(app);

const EditActivityModal = ({ isOpen, onClose, onSave, onDelete, initialActivity }) => {
    const [activity, setActivity] = useState(initialActivity);
    const [guias, setGuias] = useState([]);
    const [selectedGuia, setSelectedGuia] = useState(null);
    const [destinos, setDestinos] = useState([]);
    const [selectedDestino, setSelectedDestino] = useState(null);

    useEffect(() => {
        setActivity(initialActivity);
    }, [initialActivity]);

    useEffect(() => {
        const fetchData = async () => {
            const guiasData = await fetchUserByRol("Guía");
            setGuias(guiasData);

            const destinosData = await fetchDestinos();
            setDestinos(destinosData);
        };

        fetchData();
    }, []);

    const fetchUserByRol = async (rol) => {
        const usersCollection = collection(db, "usuario");
        const guiasQuery = query(usersCollection, where("userType", "==", rol));
        const querySnapshot = await getDocs(guiasQuery);

        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));
    };

    const fetchDestinos = async () => {
        const destinosCollection = collection(db, "destinos"); // Adjust the collection name as needed
        const querySnapshot = await getDocs(destinosCollection);

        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));
    };

    const handleSave = () => {
        onSave(activity);
        onClose();
    };

    const handleDelete = () => {
        onDelete(activity);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="p-6 rounded-lg" style={{ backgroundColor: '#f3f3e3' }}>
                <h2 className="text-2xl font-bold mb-4">Editar Actividad</h2>
                <div
                    style={{
                        backgroundColor: '#f3f3e3',
                        maxHeight: '40vh', // Set a fixed height, e.g., 40% of the viewport height
                        overflowY: 'auto'  // Enable vertical scrolling
                    }}
                >
                    <label className="block mb-2">
                        Nombre:
                        <input
                            type="text"
                            value={activity.nombre}
                            onChange={(e) => setActivity({ ...activity, nombre: e.target.value })}
                            style={{
                                padding: '0.5rem',
                                width: '100%',
                                fontSize: '1rem',
                                color: '#889E19',
                                borderRadius: '0.25rem', // Less rounded corners
                                border: '2px solid #889E19',
                                backgroundColor: '#E8EDD1'
                            }}
                        />
                    </label>

                    <label className="block mb-2">
                        Descripción:
                        <input
                            type="text"
                            value={activity.descripcion}
                            onChange={(e) => setActivity({ ...activity, descripcion: e.target.value })}
                            style={{
                                padding: '0.5rem',
                                width: '100%',
                                fontSize: '1rem',
                                color: '#889E19',
                                borderRadius: '0.25rem',
                                border: '2px solid #889E19',
                                backgroundColor: '#E8EDD1'
                            }}
                            placeholder={activity.descripcion}
                            required
                        />
                    </label>

                    <label className="block mb-2">
                        Duración:
                        <input
                            type="text"
                            value={activity.duracion}
                            onChange={(e) => setActivity({ ...activity, duracion: e.target.value })}
                            style={{
                                padding: '0.5rem',
                                width: '100%',
                                fontSize: '1rem',
                                color: '#889E19',
                                borderRadius: '0.25rem',
                                border: '2px solid #889E19',
                                backgroundColor: '#E8EDD1'
                            }}
                            placeholder={activity.duracion}
                            required
                        />
                    </label>

                    <label className="block mb-2">
                        Cupos:
                        <input
                            type="text"
                            value={activity.cupos}
                            onChange={(e) => setActivity({ ...activity, cupos: e.target.value })}
                            style={{
                                padding: '0.5rem',
                                width: '100%',
                                fontSize: '1rem',
                                color: '#889E19',
                                borderRadius: '0.25rem',
                                border: '2px solid #889E19',
                                backgroundColor: '#E8EDD1'
                            }}
                            placeholder={activity.cupos}
                            required
                        />
                    </label>

                    <label className="block mb-2">
                        Disponible:
                        <select
                            value={activity.disponible}
                            onChange={(e) => setActivity({ ...activity, disponible: e.target.value })}
                            style={{
                                padding: '0.5rem',
                                width: '100%',
                                fontSize: '1rem',
                                color: '#889E19',
                                borderRadius: '0.25rem',
                                border: '2px solid #889E19',
                                backgroundColor: '#E8EDD1'
                            }}
                        >
                            <option value="true">True</option>
                            <option value="false">False</option>
                        </select>
                    </label>

                    <label className="block mb-2">
                        Fecha:
                        <input
                            type="date" // Tipo "date" para mostrar un calendario
                            value={activity.fecha}
                            onChange={(e) => setActivity({ ...activity, fecha: new Date(e.target.value) })}
                            style={{
                            padding: '0.5rem',
                            width: '100%',
                            fontSize: '1rem',
                            color: '#889E19',
                            borderRadius: '0.25rem',
                            border: '2px solid #889E19',
                            backgroundColor: '#E8EDD1'
                            }}
                        />
                    </label>

                    <label className="block mb-2">
                        Requiere permisos:
                        <select
                            value={activity.requierePermisos}
                            onChange={(e) => setActivity({ ...activity, requierePermisos: e.target.value })}
                            style={{
                                padding: '0.5rem',
                                width: '100%',
                                fontSize: '1rem',
                                color: '#889E19',
                                borderRadius: '0.25rem',
                                border: '2px solid #889E19',
                                backgroundColor: '#E8EDD1'
                            }}
                        >
                            <option value="true">True</option>
                            <option value="false">False</option>
                        </select>
                    </label>

                    <label className="block mb-2">
                        Requiere equipo:
                        <select
                            value={activity.requiereEquipo}
                            onChange={(e) => setActivity({ ...activity, requiereEquipo: e.target.value })}
                            style={{
                                padding: '0.5rem',
                                width: '100%',
                                fontSize: '1rem',
                                color: '#889E19',
                                borderRadius: '0.25rem',
                                border: '2px solid #889E19',
                                backgroundColor: '#E8EDD1'
                            }}
                        >
                            <option value="true">True</option>
                            <option value="false">False</option>
                        </select>
                    </label>

                    <label className="block mb-2">
                        Destino:
                        <select
                            value={activity.destino || 'default'}
                            onChange={(e) => {
                                const selectedDestinoId = e.target.value;
                                const selectedDestino = destinos.find(destino => destino.id === selectedDestinoId);

                                if (selectedDestino) {
                                    setSelectedDestino(selectedDestino);
                                    setActivity({
                                        ...activity,
                                        destino: selectedDestinoId,
                                        dificultad: `${selectedDestino.dificultad}`
                                    });
                                } else {
                                    setActivity({
                                        ...activity,
                                        destino: '',
                                    });
                                }
                            }}
                            style={{
                                padding: '0.5rem',
                                width: '100%',
                                fontSize: '1rem',
                                color: '#889E19',
                                borderRadius: '0.25rem',
                                border: '2px solid #889E19',
                                backgroundColor: '#E8EDD1'
                            }}
                        >
                            <option value="default" disabled hidden>Select a destination</option>
                            {destinos.map((destino) => (
                                <option key={destino.id} value={destino.id}>
                                    {destino.nombre}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="block mb-2">
                        Guía:
                        <select
                            value={activity.guia || 'default'}
                            onChange={(e) => {
                                const selectedGuiaId = e.target.value;
                                const selectedGuia = guias.find(guia => guia.id === selectedGuiaId);

                                if (selectedGuia) {
                                    setSelectedGuia(selectedGuia);
                                    setActivity({
                                        ...activity,
                                        guia: selectedGuiaId,
                                        nombreGuia: `${selectedGuia.nombre} ${selectedGuia.apellido}`,
                                    });
                                } else {
                                    setActivity({
                                        ...activity,
                                        guia: '',
                                        nombreGuia: ''
                                    });
                                }
                            }}
                            style={{
                                padding: '0.5rem',
                                width: '100%',
                                fontSize: '1rem',
                                color: '#889E19',
                                borderRadius: '0.25rem',
                                border: '2px solid #889E19',
                                backgroundColor: '#E8EDD1'
                            }}
                        >
                            <option value="default" disabled hidden>Select a guide</option>
                            {guias.map((guia) => (
                                <option key={guia.id} value={guia.id}>
                                    {guia.nombre} {guia.apellido}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <div className="flex justify-between items-center p-4">
                    <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded">
                        Delete
                    </button>
                    <button onClick={onClose} className="text-gray-600">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditActivityModal;