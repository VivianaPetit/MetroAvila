import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App.jsx'
import AOS from 'aos';
import 'aos/dist/aos.css'; 
import { UserProvider, useUser } from './contexto/userContext.jsx';

AOS.init();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider> 
      <App />
    </UserProvider>
  </StrictMode>,
)
