import React from "react";
import profileIcon from "../assets/user-icon.svg";
import StatCard from "./StatCard";
import { useUser } from "../contexto/userContext.jsx";
import { useNavigate } from 'react-router-dom';

function ProfileInfo() {
    const { user } = useUser();
    const navigate = useNavigate();

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
                    <h1 className="mb-2.5 text-2xl font-semibold">
                        {user.name ? `${user.name} ${user.lastname || ""}` : "Usuario"}
                    </h1>
                    <p className="mb-8 text-stone-500">
                        {user.carrera ? `${user.carrera} ${user.apellido || ""}` : user.email}
                    </p>

                    {user.userType === "Admin" ? (
                        <div className="flex gap-5 mb-10 max-md:flex-col">
                            <button
                                onClick={() => navigate("/admin")}
                                className="px-10 py-5 text-center bg-orange-100 rounded-xl max-md:w-full max-sm:p-4"
                            >
                                <h2 className="mb-1.5 text-2xl font-semibold">Administrar Actividades</h2>
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-5 mb-10 max-md:flex-col">
                            <StatCard title="4/8" description="Rutas Realizadas" />
                            <StatCard title="10" description="Veces Subidas" />
                        </div>
                    )}
                </>
            ) : (
                <div className="font-extrabold text-4xl text-center text-[#889E19]">
                    No se encontró un usuario registrado
                </div>
            )}
        </>
    );
}

export default ProfileInfo;
