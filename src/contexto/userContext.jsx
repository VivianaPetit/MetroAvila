import { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../credenciales.js"; 

const auth = getAuth(app);
const db = getFirestore(app); // Inicializa Firestore

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
               
                const userDoc = await getDoc(doc(db, "usuario", currentUser.uid));

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setUser({
                        name: userData.nombre, // Nombre desde Firestore
                        lastname: userData.apellido, // Apellido desde Firestore
                        carrera: userData.carrera,
                        email: currentUser.email, // Email desde Auth
                        photo: userData.foto || currentUser.photoURL, // Foto desde Firestore o Auth
                    });
                } else {
                    
                    setUser({
                        name: currentUser.displayName || "Usuario",
                        lastname: "",
                        email: currentUser.email,
                        photo: currentUser.photoURL,
                    });
                }
            } else {
                setUser(null);
            } 
            
        });

        return () => unsubscribe();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

// Hook personalizado para acceder al contexto
export const useUser = () => useContext(UserContext);


