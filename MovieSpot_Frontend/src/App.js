import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import Homepage from "./Page/Homepage";
import MovieDetail from "./Page/MovieDetail"; 
import ReservationPage from "./Page/ReservationPage"; // Importation de la nouvelle page de réservation
import PrivateRoute from "./components/PrivateRoute"; // Importation du composant PrivateRoute
import ReservationsPage from  "./Page/MyReservationPage"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PrivateRoute element={<Homepage />} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/films/:id" element={<MovieDetail />} />
        <Route path="/reservation/:id" element={<ReservationPage />} />
        <Route path="/myreservation" element={<ReservationsPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
