import { Navigate } from "react-router-dom";

// Ce composant protège une route en vérifiant la présence d'un token
const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem("token"); // Vérifie si le token est présent dans localStorage

  if (!token) {
    // Si pas de token, rediriger vers la page de connexion
    return <Navigate to="/login" />;
  }

  return element; // Si l'utilisateur est connecté, afficher la route
};

export default PrivateRoute;
