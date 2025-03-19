import React, { useState, useEffect } from "react";

const EditActivityModal = ({ isOpen, onClose, onSave, initialActivity }) => {
    const [activity, setActivity] = useState(initialActivity);

    useEffect(() => {
        setActivity(initialActivity);
    }, [initialActivity]);

    const handleSave = () => {
        onSave(activity);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-[#0000003d]">
            <div className="p-8 rounded-lg bg-white max-w-lg w-full shadow-lg">
                <h2 className="text-3xl font-bold mb-6 text-center text-[#889e19]">Editar Actividad</h2>
                <div className="space-y-4">
                    <label className="block text-lg font-semibold text-[#333]">
                        Nombre:
                        <input
                            type="text"
                            value={activity.nombre}
                            onChange={(e) => setActivity({ ...activity, nombre: e.target.value })}
                            className="mt-2 border-2 border-[#d1d5db] rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#889e19] transition-all"
                        />
                    </label>
                    <label className="block text-lg font-semibold text-[#333]">
                        Fecha:
                        <input
                            type="text"
                            value={Date(activity.fecha).toString().split("T")[0]}
                            onChange={(e) => setActivity({ ...activity, fecha: e.target.value })}
                            className="mt-2 border-2 border-[#d1d5db] rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#889e19] transition-all"
                        />
                    </label>
                    <label className="block text-lg font-semibold text-[#333]">
                        Requiere permisos:
                        <select
                            value={activity.requierePermisos}
                            onChange={(e) => setActivity({ ...activity, requierePermisos: e.target.value })}
                            className="mt-2 border-2 border-[#d1d5db] rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#889e19] transition-all"
                        >
                            <option value="true">True</option>
                            <option value="false">False</option>
                        </select>
                    </label>
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                    <button onClick={onClose} className="text-gray-600 text-lg hover:text-[#889e19] transition-all duration-300">
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="bg-[#889e19] text-white text-lg px-4 py-2 rounded-lg hover:bg-[#6e7d14] transition-all duration-300"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}   
    

export default EditActivityModal;