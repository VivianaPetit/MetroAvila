import React, { useEffect, useState } from 'react';
import { db, auth } from '../credenciales'; 
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; 
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import AOS from 'aos';
import 'aos/dist/aos.css';

const ForumPage = () => {
    const navigate = useNavigate(); 
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [user, setUser ] = useState(null);

    useEffect(() => {
        AOS.init({ duration: 1500, once: true, easing: 'ease-in-out' });
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

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await addDoc(collection(db, 'forumMessages'), {
                text: newMessage,
                userName: user.displayName || user.email, // Usa el nombre del usuario o el correo si no está disponible
                profileImage: user.photoURL, 
                timestamp: new Date(),
            });
            setNewMessage('');
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
                        <button type="submit" className="mt-2 bg-[#889e19] text-white px-6 py-2 rounded-lg shadow hover:bg-[#728115] transition duration-200">
                            Enviar
                        </button>
                    </form>
                ) : (
                    <p className="text-red-600 text-center" data-aos="fade-up">Debes iniciar sesión para participar en el foro.</p>
                )}

                <div className="text-left py-6" data-aos="fade-up">
                    <p className="font-extrabold text-2xl text-[#FF7E00]">Mensajes</p>
                </div>

                <div className="mt-6" data-aos="fade-up">
                    <ul className="space-y-4">
                        {messages.map((message) => (
                            <li key={message.id} className="flex items-start border border-gray-300 p-4 rounded-lg shadow-sm bg-white" data-aos="fade-up">
                                {message.profileImage && (
                                    <img src={message.profileImage} alt="Perfil" className="w-10 h-10 rounded-full mr-3" />
                                )}
                                <div>
                                    <strong className="text-[#889e19]">{message.userName}:</strong> <span>{message.text}</span>
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