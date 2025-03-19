import { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../credenciales.js"; 

const auth = getAuth(app);
const db = getFirestore(app); 

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
                        id: currentUser.uid,
                        name: userData.nombre, 
                        lastname: userData.apellido, 
                        carrera: userData.carrera,
                        userType: userData.userType,
                        email: currentUser.email, 
                        photo: currentUser.photoURL, 
                    });
                } else {
                    
                    setUser({
                        id: currentUser.uid,
                        name: currentUser.displayName || "Unknown",
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


export const useUser = () => useContext(UserContext);


