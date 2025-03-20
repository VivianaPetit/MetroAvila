import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, MenuItem, Avatar, Tooltip, IconButton, Divider } from "@mui/material";
import Logout from "@mui/icons-material/Logout";
import DehazeIcon from "@mui/icons-material/Dehaze"; // Ícono de menú hamburguesa
import Button from "./Button";
import { NavBar } from "./NavBar";
import { useUser } from "../contexto/userContext";

export default function AccountMenu() {
    const { user } = useUser();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        setUser(null); // Cierra sesión
        handleClose();
    };

    return (
        <div className="flex w-[84px] h-[76px] bg-[#889E19] shadow-xl items-center justify-center px-6">
            {/* Menú Hamburguesa */}
            <div className="flex items-center">
                <Tooltip title="Menú">
                    <IconButton onClick={handleClick}>
                        <DehazeIcon fontSize="large" />
                    </IconButton>
                </Tooltip>

                
                <Menu  // Menu desplegable
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                    

                    <Divider />

                    {/* Si el usuario NO está logueado, muestra los botones de inicio/registro */}
                    <NavBar className="text-md text-[#333] hover:text-[#000000] text-center space-y-2 m-2" />

                    <Divider />

                    {!user && (
                        <>
                            <MenuItem >
                                <Button
                                    className="bg-[#889E19] hover:bg-[#6E7D14] text-[#F2F5E5] text-[15px] mt-2 font-bold py-2 px-2 rounded-lg flex"
                                    text="Registrarse"
                                    onClick={() => navigate("/signup")}
                                />
                            </MenuItem>
                            <MenuItem >
                                <Button
                                    className="bg-[#889E19] hover:bg-[#6E7D14] text-[#F2F5E5] text-[15px] font-bold py-2 px-2 rounded-lg flex"
                                    text="Iniciar Sesión"
                                    onClick={() => navigate("/login")}
                                />
                            </MenuItem>
                        </>
                    )}

                    {/* Si el usuario está logueado, muestra la opción de Logout */}
                    {user && (
                        <MenuItem onClick={handleLogout}>
                            <Logout fontSize="small" className="mr-2" />
                            Logout
                        </MenuItem>
                    )}
                </Menu>
            </div>

            {/* Logo */}
            <div className="ml-4">
                <a href="/">
                    <img src="/metroavila.svg" alt="MetroAvila Logo" className="w-[150px] h-[51px]" />
                </a>
            </div>
        </div>
    );
}
