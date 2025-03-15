import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage"; 
import LoginPage from "./pages/LoginPage"; 
import SignupPage from "./pages/SignupPage";
import DestinationPage from "./pages/DestinationPage.jsx";
import ReservationPage from "./pages/ReservationPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import DestinationDetail from "./components/DestinationDetail"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/destinations" element={<DestinationPage />} />
        <Route path="/reservation" element={<ReservationPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/destino/:id" element={<DestinationDetail />} /> 
      </Routes>
    </Router>
  );
}

export default App;