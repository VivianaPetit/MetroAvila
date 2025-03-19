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
        <div className="fixed inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="p-6 rounded-lg" style={{ backgroundColor: '#f3f3e3' }}>
                <h2 className="text-2xl font-bold mb-4">Edit Activity</h2>
                <label className="block mb-2">
                    Name:
                    <input
                        type="text"
                        value={activity.nombre}
                        onChange={(e) => setActivity({ ...activity, nombre: e.target.value })}
                        className="border p-2 w-full"
                    />
                </label>
                <label className="block mb-2">
                    Date:
                    <input
                        type="text"
                        value={activity.fecha}
                        onChange={(e) => setActivity({ ...activity, fecha: e.target.value })}
                        className="border p-2 w-full"
                    />
                </label>
                <label className="block mb-2">
                    Status:
                    <select
                        value={activity.requierePermisos}
                        onChange={(e) => setActivity({ ...activity, requierePermisos: e.target.value })}
                        className="border p-2 w-full"
                    >
                        <option value="true">True</option>
                        <option value="false">False</option>
                    </select>
                </label>
                <div className="flex justify-end">
                    <button onClick={onClose} className="mr-2 text-gray-600">
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