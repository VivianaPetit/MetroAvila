import React, { useState } from "react";
import SocialAuthButton from "../components/SocialAuthButton";
import FormInput from "../components/FormInput";
import Button from "../components/Button.jsx";
import Dropdown from "../components/Dropdown";
import divider from "../assets/divider.png";
import google from "../assets/google.png";
import instagram from "../assets/instagram.png";
import facebook from "../assets/facebook.png";
import { useNavigate } from 'react-router-dom';
import { app } from "../credenciales";
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import banner2 from "../assets/campus.jpg";
import { db } from "../credenciales";
import { doc, setDoc } from "firebase/firestore"; 


const auth = getAuth(app);

function SignupPage() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [lastName, setlastName] = useState('');
    const [carnet, setCarnet] = useState('');
    const [carrera, setCarrera] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('');
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [errors, setErrors] = useState({
        name: "",
        lastName: "",
        carnet: "",
        carrera: "",
        email: "",
        password: "",
        userType: "",
    });

    const userOptions = ["Estudiante", "Guía"];

    const handleGoogleSignup = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            setMessage("Registro con Google exitoso. Redirigiendo..."); 
            setTimeout(() => navigate("/"), 2000);
        } catch (error) {
            setError("Error al autenticar con Google: " + error.message);
        }
    };

    const handleFacebookSignup = async () => {
        const provider = new FacebookAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            setMessage("Registro con Facebook exitoso. Redirigiendo..."); 
            setTimeout(() => navigate("/"), 2000); // EDITADO
        } catch (error) {
            setError("Error al autenticar con Facebook: " + error.message); 
        }
    };

    const handleInstagramSignup = () => {
        setError("Instagram no está soportado directamente por Firebase.");
    };

    const validateForm = () => {
        const newErrors = {
            name: "",
            lastName: "",
            carnet: "",
            carrera: "",
            email: "",
            password: "",
            userType: "",
        };

        let isValid = true;

        // Validación del nombre
        if (!name.trim()) {
            newErrors.name = "El nombre es obligatorio.";
            isValid = false;
        } else if (name.trim().length < 2) {
            newErrors.name = "El nombre debe tener al menos 2 caracteres.";
            isValid = false;
        }

         // Validación del apellido
         if (!lastName.trim()) {
            newErrors.lastName = "El nombre es obligatorio.";
            isValid = false;
        } else if (lastName.trim().length < 2) {
            newErrors.lastName = "El nombre debe tener al menos 2 caracteres.";
            isValid = false;
        }

        // Validación del número de carnet
        if (!carnet.trim()) {
            newErrors.carnet = "El número de carnet es obligatorio.";
            isValid = false;
        } else if (isNaN(carnet)) {
            newErrors.carnet = "El número de carnet debe ser un número válido.";
            isValid = false;
        }

        // Validación de la carrera
        if (!carrera.trim()) {
            newErrors.carrera = "La carrera es obligatoria.";
            isValid = false;
        }

        // Validación del email
        if (!email.trim()) {
            newErrors.email = "El email es obligatorio.";
            isValid = false;
        } else if (!/^[a-zA-Z0-9._%+-]+@correo\.unimet\.edu\.ve$/.test(email)) {
            newErrors.email = "El email no es válido. Debe ser tu correo UNIMET";
            isValid = false;
        }

        // Validación de la contraseña
        if (!password.trim()) {
            newErrors.password = "La contraseña es obligatoria.";
            isValid = false;
        } else if (password.trim().length < 6) {
            newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
            isValid = false;
        }

        // Validación del tipo de usuario
        if (!userType) {
            newErrors.userType = "Debes seleccionar un tipo de usuario.";
            isValid = false;
        }

        // Actualiza el estado de errores
        setErrors(newErrors);
        return isValid;
    };

    async function handleSignup(e) {
        e.preventDefault();
    
        // Validar el formulario
        if (!validateForm()) {
            return; // Detener el registro si hay errores
        }
    
        try {
            // Registra al usuario con Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user; // Obtenemos el objeto de usuario
    
            // Crear un documento de usuario en Firestore
            const userRef = doc(db, "usuario", user.uid); // Crear un documento con el ID del usuario
    
            // Datos a guardar en Firestore
            const userData = {
                nombre: name,
                apellido: lastName,
                carnet: carnet,
                carrera: carrera,
                userType: userType,
                email: email,
                reservas: []
            };
    
            // Guardar los datos del usuario en Firestore
            await setDoc(userRef, userData);
    
            setMessage("Registro exitoso. Redirigiendo...");
            setTimeout(() => navigate("/"), 2000); // Redirige después de un pequeño retraso
        } catch (error) {
            setError("Error al registrar el usuario: " + error.message);
        }
    }
    

    return (
        <div className="flex min-h-screen items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url(${banner2})` }}>
            <div className="w-full max-w-xl mx-4 p-8 bg-[#F2F5E5] rounded-lg shadow-lg my-24">
                <h1 className="text-2xl lg:text-4xl font-extrabold mb-1 text-[#889e19]">Registro</h1>
                <h2 className="text-base lg:text-lg text-black mb-2">Regístrate con:</h2>

                <div className="flex justify-center gap-4 mb-4 w-full">
                    <SocialAuthButton image={google} altText="Google" onClick={handleGoogleSignup} />
                    <SocialAuthButton image={instagram} altText="Instagram" onClick={handleInstagramSignup} />
                    <SocialAuthButton image={facebook} altText="Facebook" onClick={handleFacebookSignup} />
                </div>

                <img src={divider} alt="Separador" className="mb-4 w-full" />
                {message && <p className="text-center text-green-600 font-bold mb-3">{message}</p>} 
                {error && <p className="text-center text-red-600 font-bold mb-3">{error}</p>} 

                <form onSubmit={handleSignup} className="w-full">
                    <div className="flex flex-col gap-1 mb-1">
                        <div>
                            <label className="text-base font-black text-[#889E19] mb-1">Nombre</label>
                            <FormInput
                                label="Nombre"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                texto="Ingresa tu nombre"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="text-base font-black text-[#889E19] mb-1">Apellido</label>
                            <FormInput
                                label="Apellido"
                                type="text"
                                value={lastName}
                                onChange={(e) => setlastName(e.target.value)}
                                texto="Ingresa tu apellido"
                            />
                            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                        </div>
                        <div>
                            <label className="text-base font-black text-[#889E19] mb-1">Número de Carnet</label>
                            <FormInput
                                label="Carnet"
                                type="text"
                                value={carnet}
                                onChange={(e) => setCarnet(e.target.value)}
                                texto="Ingresa tu carnet"
                            />
                            {errors.carnet && <p className="text-red-500 text-sm mt-1">{errors.carnet}</p>}
                        </div>
                    </div>

                    <div className="mb-2">
                        <label className="text-base font-black text-[#889E19] mb-1">Carrera</label>
                        <FormInput
                            label="Carrera"
                            type="text"
                            value={carrera}
                            onChange={(e) => setCarrera(e.target.value)}
                            texto="Ingresa tu carrera"
                        />
                        {errors.carrera && <p className="text-red-500 text-sm mt-1">{errors.carrera}</p>}
                    </div>

                    <div className="mb-2">
                        <label className="text-base font-black text-[#889E19] mb-1">Email</label>
                        <FormInput
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            texto="Ingresa tu correo unimet"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div className="mb-2">
                        <label className="text-base font-black text-[#889E19] mb-1">Contraseña</label>
                        <FormInput
                            label="Contraseña"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            texto="Ingresa tu contraseña"
                        />
                    </div>
                        <label className="text-base font-black text-[#889E19] mb-1">¿Eres Estudiante o Guía?</label>
                            <div className="flex-1 mb-2 mt-2">
                                <Dropdown
                                    options={userOptions}
                                    selectedOption={userType}
                                    onSelect={(option) => setUserType(option)}
                                />
                                {errors.userType && <p className="text-red-500 text-sm mt-1">{errors.userType}</p>}
                            </div>
                            <div className="mb-2 mt-4">
                                <Button
                                    className="bg-[#889e19] hover:bg-[#6E7D14] text-white font-extrabold rounded-3xl border border-gray-300 
                                                w-full h-12"
                                    text="Registrarse"
                                    type="submit"
                                />
                            </div>
                </form>
                

            {/* Enlace para iniciar sesión */}
            <p className="text-sm text-black">
                ¿Ya tienes una cuenta?
                <button
                    onClick={() => navigate("/login")}
                    className="font-bold text-[#FF7E00] hover:text-[#ff5100] cursor-pointer ml-2"
                    aria-label="Inicia Sesión"
                >
                    Inicia Sesión
                </button>
            </p>
        </div>
    </div>
);
}

export default SignupPage;