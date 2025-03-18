import React, { useEffect, useState } from 'react';
import { db, auth } from '../credenciales'; 
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; 
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';

const ForumPage = () => {
    const navigate = useNavigate(); 
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [user, setUser ] = useState(null);

   
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
                user: user.email,
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
                <h1 className="text-3xl text-[#889e19] font-bold mb-6">Foro</h1>

                {user ? (
                    <form onSubmit={handleSendMessage} className="mb-4">
                        <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Escribe tu opinión..."
                            className="w-full p-2 border border-gray-300 rounded"
                            rows="4"
                        />
                        <button type="submit" className="mt-2 bg-[#889e19] text-white px-4 py-2 rounded">
                            Enviar
                        </button>
                    </form>
                ) : (
                    <p className="text-red-600">Debes iniciar sesión para participar en el foro.</p>
                )}

                <div className="mt-6">
                    <h2 className="text-2xl font-semibold">Mensajes</h2>
                    <ul className="mt-4">
                        {messages.map((message) => (
                            <li key={message.id} className="border-b py-2">
                                <strong>{message.user}:</strong> {message.text}
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