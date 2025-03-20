import React, { useEffect, useState } from 'react';
import { db, auth } from '../credenciales'; 
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; 
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import AOS from 'aos';
import 'aos/dist/aos.css';

const StarRating = ({ rating, setRating }) => {
    return (
        <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    className={`cursor-pointer text-2xl ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                    onClick={() => setRating(star)}
                >
                    ★
                </span>
            ))}
        </div>
    );
};

const ForumPage = () => {
    const navigate = useNavigate(); 
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [user, setUser ] = useState(null);
    const [rating, setRating] = useState(0); 
    const [destinos, setDestinos] = useState([]); 
    const [selectedDestino, setSelectedDestino] = useState(''); 
    const [error, setError] = useState(''); 

    useEffect(() => {
        AOS.init({ duration: 1000, once: true, easing: 'ease-in-out' });
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser ) => {
            setUser (currentUser );
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'forumMessages'), (snapshot) => {
            const messagesList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMessages(messagesList);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'destinos'), (snapshot) => {
            const destinosList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setDestinos(destinosList);
        });
        return () => unsubscribe();
    }, []);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        
        if (!newMessage.trim()) {
            setError("El mensaje no puede estar vacío.");
            return;
        }

        if (!selectedDestino) {
            setError("Debes seleccionar un destino antes de enviar el mensaje.");
            return;
        }

        try {
            await addDoc(collection(db, 'forumMessages'), {
                text: newMessage,
                user: user.email,
                profileImage: user.photoURL, 
                timestamp: new Date(),
                rating: rating, 
                destino: selectedDestino 
            });

            setNewMessage('');
            setRating(0); 
            setSelectedDestino(''); 
            setError(''); 
        } catch (error) {
            console.error("Error al enviar el mensaje: ", error);
        }
    };

    return (
        <div className="min-h-screen bg-[#F2F5E5]">
            <Header />
            <main className="p-8">
                <h1 className="text-3xl text-[#889e19] font-bold mb-6 text-left" data-aos="fade-up">Foro</h1>

                {user ? (
                    <form onSubmit={handleSendMessage} className="mb-6" data-aos="fade-up">
                        <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Escribe tu opinión..."
                            className="w-full p-4 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#889e19] transition duration-200"
                            rows="4"
                        />
                        <StarRating rating={rating} setRating={setRating} /> 
                        
                        <select
                            value={selectedDestino}
                            onChange={(e) => setSelectedDestino(e.target.value)}
                            className="mt-2 w-full p-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#889e19] transition duration-200"
                        >
                            <option value="">Selecciona el destino que visitaste!</option>
                            {destinos.map((destino) => (
                                <option key={destino.id} value={destino.nombre}>
                                    {destino.nombre}
                                </option>
                            ))}
                        </select>

                        {error && <p className="text-red-500 mt-2">{error}</p>}

                        <button type="submit" className="mt-2 bg-[#889e19] text-white px-6 py-2 rounded-lg shadow hover:bg-[#728115] transition duration-200">
                            Enviar
                        </button>
                    </form>
                ) : (
                    <p className="text-red-600 text-center" data-aos="fade-up">Debes iniciar sesión para participar en el foro.</p>
                )}

                <div className="text-left py-6" data-aos="fade-up">
                    <p className="font-extrabold text-2xl text-[#FF7E00] ">Mensajes</p>
                </div>

                <div className="mt-6" data-aos="fade-up">
                    <ul className="space-y-4">
                        {messages.map((message) => (
                            <li key={message.id} className="flex items-start border border-gray-300 p-4 rounded-lg shadow-sm bg-white" data-aos="fade-up">
                                {message.profileImage && (
                                    <img src={message.profileImage} alt="Perfil" className="w-10 h-10 rounded-full mr-3" />
                                )}
                                <div>
                                    <strong className="text-[#889e19]">{message.user}:</strong> <span>{message.text}</span>

                                    {message.destino && (
                                        <p className="text-sm text-gray-600 mt-2"><strong>Destino visitado:</strong> {message.destino}</p>
                                    )}

                                    <div className="mt-2">
                                        {Array.from({ length: 5 }, (_, index) => (
                                            <span key={index} className={`text-2xl ${index < message.rating ? 'text-yellow-500' : 'text-gray-300'}`}>
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ForumPage;