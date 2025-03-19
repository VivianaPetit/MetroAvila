import React, { useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from "firebase/auth";
import SocialAuthButton from "../components/SocialAuthButton";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import divider from "../assets/divider.png";
import google from "../assets/google.png";
import instagram from "../assets/instagram.png";
import facebook from "../assets/facebook.png";
import { app } from "../credenciales";
import banner2 from "../assets/campus.jpg";
import { useNavigate } from 'react-router-dom';

const auth = getAuth(app);

function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(""); 
    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });

    const validateLoginForm = () => {
        const newErrors = { email: "", password: "" };
        let isValid = true;

        if (!email.trim()) {
            newErrors.email = "El email es obligatorio.";
            isValid = false;
        } else if (!/^[a-zA-Z0-9._%+-]+@correo\.unimet\.edu\.ve$/.test(email) ) {
            newErrors.email = "El email no es válido.";
            isValid = false;
        }

        if (!password.trim()) {
            newErrors.password = "La contraseña es obligatoria.";
            isValid = false;
        } else if (password.length < 6) {
            newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        if (!validateLoginForm()) return; 

        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setSuccess(true);
            setTimeout(() => navigate("/"), 1500);
        } catch (error) {
            setError("Error: Correo o contraseña incorrectos.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            setSuccess(true);
            setTimeout(() => navigate("/"), 1500);
            navigate("/");
        } catch (error) {
            setError("Error al autenticar con Google.");
        }
    };
    const handleAdminLogin = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        if (!validateLoginForm()) return;

        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log("User ID:", user.uid);// Access the user ID here
            const db = getFirestore(app);
            const userDocRef = doc(db, "usuario", user.uid);
            const userDocSnap = await getDoc(userDocRef);
            console.log("User ID snap:", userDocSnap);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                console.log("User Data:", userData);

                if (userData.userType === "Admin") {
                    console.log("User is an Admin.");
                    setTimeout(() => navigate("/admin"), 1500);
                    setSuccess(true);
                    
                } else {
                    console.log("User is not an Admin.");
                    setError("Este usuario no es Admin")
                    
                }
            } else {
                console.log("No such document!");
                setError("El correo o la contraseña son incorrectos");
                return; 
            }
        } catch (error) {
            setError("Error: Correo o contraseña incorrectos.");
        } finally {
            setLoading(false);
        }
    };
    const handleFacebookLogin = async () => {
        const provider = new FacebookAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            setSuccess(true);
            setTimeout(() => navigate("/"), 1500);
            navigate("/");
        } catch (error) {
            setError("Error al autenticar con Facebook.");
        }
    };

    const handleInstagramLogin = () => {
        console.log("Instagram no está soportado directamente por Firebase.");
    };

    return (
        <div className="flex min-h-screen bg-right-top" style={{ backgroundImage: `url(${banner2})` }}>
            <div className="w-full max-w-md flex flex-col items-center justify-center p-6 bg-[#F2F5E5] mx-auto rounded-lg shadow-lg">
                <h1 className="text-2xl lg:text-4xl font-extrabold mb-1 text-[#889e19] text-center">
                    Inicio de Sesión
                </h1>
                <h2 className="text-lg lg:text-xl text-black mb-4 text-center">
                    Inicia Sesión con:
                </h2>

                <div className="flex justify-center gap-4 mb-8 flex-wrap">
                    <SocialAuthButton image={google} altText="Google" onClick={handleGoogleLogin} />
                    <SocialAuthButton image={instagram} altText="Instagram" onClick={handleInstagramLogin} />
                    <SocialAuthButton image={facebook} altText="Facebook" onClick={handleFacebookLogin} />
                </div>

                <img src={divider} alt="Separador" className="mb-5 w-full" />

                {error && <p className="text-red-600 font-semibold mb-3 text-center">{error}</p>}
                {success && <p className="text-green-600 font-semibold mb-3 text-center">Inicio de sesión exitoso. Redirigiendo...</p>}

                <form onSubmit={handleLogin} className="">
                    <label className="mb-2 text-lg font-black text-[#889E19]">Email</label>
                    <FormInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} texto="tucorreo@correo.uimet.edu.ve" className="w-full" />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

                    <label className="mb-2 text-lg font-black text-[#889E19]">Contraseña</label>
                    <FormInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} texto="••••••••" className="w-full" />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                    <div className="place-items-center">
                        <Button 
                            className={`bg-[#889e19] hover:bg-[#6E7D14] cursor-pointer text-white font-extrabold rounded-3xl border border-gray-300 
                            w-full lg:w-[226px] h-[48px] ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                            text={loading ? "Cargando..." : "Iniciar Sesión"}
                            type="submit"
                            disabled={loading}
                        />
                    </div>
                </form>

                <div className="flex flex-col w-full mt-5 text-center">
                    <p className="text-black text-sm mb-2">
                        ¿Aún no tienes cuenta? 
                        <button 
                            onClick={() => navigate("/signup")} 
                            className="font-bold text-[#FF7E00] cursor-pointer hover:text-[#ff5100] transition-all ml-1"
                            aria-label="Regístrate"
                        >
                            Regístrate
                        </button>
                    </p>
                    <p className="text-black text-sm">
                        Ir al panel de
                        <button onClick={handleAdminLogin} className="font-bold text-[#889E19] cursor-pointer hover:text-[#6E7D14] transition-all ml-1">Administración</button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
