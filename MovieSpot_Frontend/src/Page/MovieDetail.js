import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, Button, Spinner, Badge } from "react-bootstrap";
import Navigation from "../components/Navbar"; // Importation de la navbar

const MovieDetail = () => {
  const { id } = useParams(); // Récupérer l'ID du film depuis l'URL
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Pour gérer les erreurs
  const navigate = useNavigate();

  const token = localStorage.getItem("token"); // Récupérer le token depuis le localStorage

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!token) {
        setError("Vous devez être connecté pour voir les détails du film.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3000/movies/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Ajouter le token à l'en-tête
          },
        });
        setMovie(response.data); // Stocker les informations du film
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des détails du film :", error);
        setError("Erreur lors de la récupération des données");
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id, token]); // Ajout du token dans les dépendances pour actualiser la récupération si le token change

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return <h2 className="text-center text-danger">{error}</h2>;
  }

  if (!movie) {
    return <h2 className="text-center text-muted">Film non trouvé</h2>;
  }

  return (
    <div className="bg-light" style={{ minHeight: "100vh", paddingTop: "80px" }}>
      <Navigation />  {/* Navbar ajoutée ici */}
      <Container>
        <Row className="g-4">
          {/* Image du film */}
          <Col md={5}>
            <Card>
              <Card.Img
                variant="top"
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                style={{
                  height: "700px",
                  width: "100%",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
            </Card>
          </Col>

          {/* Informations sur le film */}
          <Col md={7}>
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title className="display-3">{movie.title}</Card.Title>
                <Card.Subtitle className="mb-3 text-muted">{movie.release_date}</Card.Subtitle>

                {/* Genres */}
                <div className="mb-3">
                  {movie.genres && movie.genres.map((genre) => (
                    <Badge key={genre.id} pill bg="info" className="me-2">
                      {genre.name}
                    </Badge>
                  ))}
                </div>

                {/* Résumé */}
                <Card.Text>
                  <strong>Résumé : </strong>{movie.overview}
                </Card.Text>

                {/* Popularité et Note */}
                <Card.Text>
                  <strong>Popularité : </strong>{movie.popularity} <br />
                  <strong>Note : </strong>{movie.vote_average} / 10 (sur {movie.vote_count} votes)
                </Card.Text>

                {/* Durée du film */}
                <Card.Text>
                  <strong>Durée : </strong>{movie.runtime} minutes
                </Card.Text>

                {/* Budget */}
                {movie.budget && (
                  <Card.Text>
                    <strong>Budget : </strong>{movie.budget.toLocaleString()} $
                  </Card.Text>
                )}

                {/* Production */}
                {movie.production_companies && movie.production_companies.length > 0 && (
                  <Card.Text>
                    <strong>Production : </strong>{movie.production_companies[0].name}
                  </Card.Text>
                )}

                {/* Réservation */}
                <Button 
                  variant="primary" 
                  onClick={() => navigate(`/reservation/${id}`, { state: { movie } })} // Passe les infos du film
                  className="mt-4"
                >
                  Réserver ce film
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MovieDetail;
