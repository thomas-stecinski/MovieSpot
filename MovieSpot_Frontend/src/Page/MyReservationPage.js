import React, { useState, useEffect } from "react";
import { Container, Card, Row, Col, Alert, Spinner, OverlayTrigger, Tooltip, Button } from "react-bootstrap";
import Navigation from "../components/Navbar";
import axios from "axios";

const MyReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [moviesData, setMoviesData] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getAuthToken = () => localStorage.getItem("token");

  useEffect(() => {
    const fetchReservations = async () => {
      const token = getAuthToken();
      if (!token) {
        setMessage({ type: "danger", text: "Vous devez être connecté pour voir vos réservations." });
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("https://moviespot-efrei.onrender.com/reservations", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setReservations(response.data);
        fetchMoviesData(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des réservations :", error);
        setMessage({ type: "danger", text: "Erreur lors du chargement des réservations." });
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const fetchMoviesData = async (reservationsList) => {
    const token = getAuthToken();
    const moviesInfo = {};

    for (const res of reservationsList) {
      if (!moviesInfo[res.movieId]) {
        try {
          const movieResponse = await axios.get(`https://moviespot-efrei.onrender.com/movies/${res.movieId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          moviesInfo[res.movieId] = movieResponse.data;
        } catch (error) {
          console.error(`Erreur lors de la récupération du film ${res.movieId} :`, error);
        }
      }
    }

    setMoviesData(moviesInfo);
  };

  const timeSlots = [
    "10h00", "11h00", "12h00", "13h00", "14h00", "15h00", "16h00",
    "17h00", "18h00", "19h00", "20h00", "21h00", "22h00", "23h00", "00h00", "01h00"
  ];

  const getOccupiedSlotInfo = (time) => {
    if (!reservations.length) return null;

    const slotDate = new Date(selectedDate);
    const [hours, minutes] = time.split("h");
    slotDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

    return reservations.find((res) => {
      const startTime = new Date(res.startTime);
      const endTime = new Date(res.endTime);

      if (slotDate >= startTime && slotDate < endTime) {
        return res;
      }
      return null;
    });
  };

  const goToNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(selectedDate.getDate() + 1);
    setSelectedDate(nextDay);
  };

  const goToPreviousDay = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(selectedDate.getDate() - 1);
    setSelectedDate(prevDay);
  };
  const cancelReservation = async (reservationId) => {
    const token = getAuthToken();
    if (!token) return;
  
    try {
      await axios.delete(`https://moviespot-efrei.onrender.com/reservations/${reservationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setReservations(reservations.filter((res) => res.id !== reservationId));
      setMessage({ type: "success", text: "Réservation annulée avec succès." });
    } catch (error) {
      console.error("Erreur lors de l'annulation :", error);
      setMessage({ type: "danger", text: "Impossible d'annuler la réservation." });
    }
  };
  

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 pt-5">
      <Navigation />
      <Container fluid>
        <Row className="gx-3">
          {/* Colonne de droite - Cartes des films plus larges */}
          <Col md={9}>
            <h2 className="my-3 text-center">Mes Réservations</h2>

            {message && <Alert variant={message.type}>{message.text}</Alert>}

            {reservations.length === 0 ? (
              <Alert variant="info" className="text-center">
                Vous n'avez aucune réservation.
              </Alert>
            ) : (
              <div className="d-flex flex-column align-items-center">
                {reservations.map((res, index) => {
                  const startTime = new Date(res.startTime);
                  const endTime = new Date(res.endTime);
                  const movie = moviesData[res.movieId];

                  return (
                    <Card key={index} className="mb-2 shadow-sm w-100" style={{ maxWidth: "1100px" }}>
                        <Row className="g-0 align-items-center">
                        <Col md={3} className="d-flex justify-content-center align-items-stretch">
                            {movie && movie.poster_path ? (
                                <Card.Img
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                                className="img-fluid rounded-start"
                                style={{ height: "100%", objectFit: "cover", width: "100%" }}
                                />
                            ) : (
                                <div 
                                className="bg-secondary d-flex align-items-center justify-content-center rounded-start"
                                style={{ height: "100%", width: "100%" }}
                                >
                                <span className="text-white">Image non disponible</span>
                                </div>
                            )}
                            </Col>
                            <Col md={9}>
                            <Card.Body>
                                <Card.Title className="fw-bold">{movie ? movie.title : "Titre non disponible"}</Card.Title>
                                <Card.Text className="text-muted">{movie ? movie.overview : "Description non disponible"}</Card.Text>
                                <hr />
                                <Row>
                                <Col xs={6}>
                                    <Card.Text><strong>Durée :</strong> {movie ? movie.runtime : "N/A"} min</Card.Text>
                                </Col>
                                <Col xs={6}>
                                    <Card.Text><strong>Date :</strong> {startTime.toLocaleDateString("fr-FR")}</Card.Text>
                                </Col>
                                </Row>
                                <Row>
                                <Col xs={6}>
                                    <Card.Text><strong>Heure de début :</strong> {startTime.toLocaleTimeString("fr-FR")}</Card.Text>
                                </Col>
                                <Col xs={6}>
                                    <Card.Text><strong>Heure de fin :</strong> {endTime.toLocaleTimeString("fr-FR")}</Card.Text>
                                </Col>
                                </Row>
                                
                                {/* Bouton d'annulation de la réservation */}
                                <div className="d-flex justify-content-end mt-3">
                                <Button variant="primary" onClick={() => cancelReservation(res.id)}>
                                    Annuler la réservation
                                </Button>
                                </div>
                            </Card.Body>
                            </Col>
                        </Row>
                        </Card>

                  );
                })}
              </div>
            )}
          </Col>

          {/* Colonne de gauche - Planning des créneaux horaires */}
        <Col md={3} className="d-flex flex-column align-items-center mt-4"
        style={{
            position: "fixed", // Fixe le planning à l'écran
            right: "20px", // L'aligne à droite
            top: "50%", // Centre verticalement
            transform: "translateY(-50%)", // Ajuste pour un bon centrage
            backgroundColor: "#f8f9fa", // Fond clair pour bien voir
            padding: "15px",
            borderRadius: "8px",
            zIndex: "1000", // S'assure qu'il est toujours visible
        }}>
        
        <div className="d-flex align-items-center">
            <Button variant="light" className="mx-1" onClick={goToPreviousDay}>&larr;</Button>
            <h5 className="text-center my-3 mx-2">
            {selectedDate.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
            </h5>
            <Button variant="light" className="mx-1" onClick={goToNextDay}>&rarr;</Button>
        </div>

        <div className="d-flex flex-column align-items-center mt-3">
            {timeSlots.map((time, index) => {
                const occupiedSlot = getOccupiedSlotInfo(time);

                return occupiedSlot ? (
                // Affichage du créneau avec tooltip quand il y a une réservation
                <OverlayTrigger
                    key={index}
                    placement="top"
                    overlay={<Tooltip>{occupiedSlot.movieTitle}</Tooltip>}
                >
                    <Card className="mb-1 border-danger text-danger" 
                        style={{ width: "150px", backgroundColor: "#f8d7da" }}>
                    <Card.Body className="p-1 text-center">
                        <Card.Text className="mb-0">{time}</Card.Text>
                    </Card.Body>
                    </Card>
                </OverlayTrigger>
                ) : (
                // Affichage normal sans tooltip si le créneau est libre
                <Card key={index} className="mb-1" style={{ width: "150px", backgroundColor: "transparent" }}>
                    <Card.Body className="p-1 text-center">
                    <Card.Text className="mb-0">{time}</Card.Text>
                    </Card.Body>
                </Card>
                );
            })}
        </div>
        </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MyReservationsPage;
