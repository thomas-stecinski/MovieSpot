import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Convertit en secondes

    if (decodedToken.exp < currentTime) {
      // Token expiré → Déconnexion automatique
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      return <Navigate to="/login" />;
    }

    return element;
  } catch (error) {
    // Token invalide ou corrompu → Déconnexion automatique
    localStorage.removeItem("token");
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute;
