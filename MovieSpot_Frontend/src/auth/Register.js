import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Étape 1 : Inscription
      await axios.post("http://localhost:3000/auth/register", formData);

      // Étape 2 : Connexion automatique
      const loginResponse = await axios.post("http://localhost:3000/auth/login", {
        email: formData.email,
        password: formData.password
      });

      // Sauvegarde du token et du username
      localStorage.setItem("token", loginResponse.data.token);
      localStorage.setItem("username", loginResponse.data.username);

      navigate("/"); // Redirection vers l'accueil
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-sm p-4" style={{ width: '400px', borderRadius: '12px' }}>
        <div className="text-center mb-4">
          <h3 className="fw-bold">Créer un compte</h3>
          <p className="text-muted">Inscrivez-vous pour continuer</p>
        </div>

        {error && <div className="alert alert-danger text-center">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Nom d'utilisateur</label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Entrez votre nom d'utilisateur"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Adresse email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Entrez votre email"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Mot de passe</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Entrez votre mot de passe"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2 mt-3" disabled={loading}>
            {loading ? "Inscription..." : "S'inscrire"}
          </button>
        </form>

        <div className="text-center mt-3">
          <p className="text-muted">
            Déjà un compte ? <a href="/login" className="text-decoration-none">Connectez-vous</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
