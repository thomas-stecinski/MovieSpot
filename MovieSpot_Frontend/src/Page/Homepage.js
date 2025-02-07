import { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "../components/Navbar"; // Importation de la navbar
import { Card, Row, Col, Spinner, Form } from "react-bootstrap"; // Import Bootstrap pour la mise en page
import { useNavigate } from "react-router-dom"; // Pour la navigation

const Homepage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // Nouvelle variable d'état pour la recherche
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const token = localStorage.getItem("token"); // Récupérer le token
  const navigate = useNavigate(); // Utiliser navigate pour rediriger vers la page de détail

  const API_URL = "https://moviespot-efrei.onrender.com/movies"; // Remplace par l'URL de ton API

  useEffect(() => {
    setUsername(localStorage.getItem("username"));

    const fetchMovies = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`, // Envoie du token pour l'authentification
          },
          params: {
            page: 1, // Affichage de la première page
            sort: "popularity.desc", // Trier par popularité décroissante
            search: searchQuery, // Passer la query de recherche ici
          },
        });

        setMovies(response.data.results); // Stocker les films reçus
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des films :", error);
        setLoading(false);
      }
    };

    if (token) {
      fetchMovies();
    }
  }, [searchQuery, token]); // Re-exécute la recherche lorsque searchQuery change

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="bg-light pt-5" style={{ minHeight: "100vh" }}>
      <Navigation />

      <div className="container mt-5 pt-3">
        {/* Titre aligné à gauche et plus petit */}
        <h1 className="text-left font-weight-bold text-dark mb-4" style={{ fontFamily: "'Roboto', sans-serif", fontSize: "1.5rem" }}>
        Films en Salle
        </h1>


        {/* Barre de recherche élégante */}
        <div className="d-flex justify-content-center mb-5">
          <Form className="w-75 d-flex">
            <Form.Control
              type="text"
              placeholder="Rechercher un film..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="p-3 rounded-pill border-0 shadow-sm"
              style={{ fontSize: "1rem" }}
            />
          </Form>
        </div>

        {/* Grille de films */}
        <Row className="g-4">
          {movies.length > 0 ? (
            movies.map((movie) => (
              <Col key={movie.id} md={3} sm={6} className="mb-4">
                <Card
                className="shadow-sm rounded border-0"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/films/${movie.id}`)} // Passe l'ID du film dans l'URL
                >
                <Card.Img
                    variant="top"
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    style={{ height: "400px", objectFit: "cover" }}
                />
                <Card.Body>
                    <Card.Title className="text-dark text-center">{movie.title}</Card.Title>
                </Card.Body>
                </Card>

              </Col>
            ))
          ) : (
            <h4 className="text-center text-muted mt-5">Aucun film trouvé</h4>
          )}
        </Row>
      </div>
    </div>
  );
};

export default Homepage;
