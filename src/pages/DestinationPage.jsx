import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Destination } from "../components/Destination.jsx";
import { db } from "../credenciales.js";
import { collection, getDocs } from "firebase/firestore";

function DestinationPage() {
    const [destinos, setDestinos] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        AOS.init();


    const fetchDestinos = async () => {
        try {
            const destinosCollection = collection(db, "destinos");
            const destinosSnapshot = await getDocs(destinosCollection);
            const destinosList = destinosSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setDestinos(destinosList);
        } catch (error) {
            console.error("Error fetching destinos: ", error);
           
        } finally {
            setLoading(false);
        }
    };
    fetchDestinos();
}, []);

    useEffect(() => {
        if (!loading) {
            AOS.refresh();
        }
    }, [destinos, loading]);

    return (
        <div className="bg-[#F2F5E5] min-h-screen">
            <Header />

            <main className="p-8">
                <h1 className="text-3xl text-[#889e19] font-bold mb-6" data-aos="fade-up" data-aos-once="true">
                    Destinos Turísticos
                </h1>

                {loading ? (
                    <p className="text-center text-[18px] text-gray-800 font-semibold animate-pulse">Cargando destinos...</p>
                ) : (

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {destinos.map((destino) => (
                            <div key={destino.id} data-aos="fade-up" data-aos-duration="1000">
                                <Destination destino={destino} />
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

export default DestinationPage;