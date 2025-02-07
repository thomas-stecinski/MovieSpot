import React, { useState, useEffect } from "react";
import { Container, Button, Card, Alert, Spinner, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Navigation from "../components/Navbar";
import axios from "axios";

const ReservationPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const movieData = location.state?.movie;
  const [movie, setMovie] = useState(movieData || null);
  const [reservations, setReservations] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  const getAuthToken = () => localStorage.getItem("token");

  const [hoveredTime, setHoveredTime] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      const token = getAuthToken();
      if (!token) {
        setMessage({ type: "danger", text: "Vous devez être connecté pour voir les réservations." });
        setLoading(false);
        return;
      }

      try {
        const reservationsResponse = await axios.get("http://localhost:3000/reservations", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setReservations(reservationsResponse.data);

        if (!movie) {
          const movieResponse = await axios.get(`http://localhost:3000/movies/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setMovie(movieResponse.data);
        }

        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        setMessage({ type: "danger", text: "Erreur lors du chargement des données." });
        setLoading(false);
      }
    };

    fetchData();
  }, [id, movie]);

  const daysOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
  const timeSlots = [
     "00h00", "01h00","10h00", "11h00", "12h00", "13h00", "14h00", "15h00", "16h00",
    "17h00", "18h00", "19h00", "20h00", "21h00", "22h00", "23h00"
  ];

  const isSlotDisabled = (time, dayIndex) => {
    if (!reservations.length || !movie?.runtime) return false;
  
    const slotDate = new Date(selectedDate);
    slotDate.setDate(selectedDate.getDate() - selectedDate.getDay() + 1 + dayIndex);
    
    const [hours, minutes] = time.split("h");
    slotDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
  
    return reservations.some((res) => {
      const startTime = new Date(res.startTime);
      const endTime = new Date(res.endTime);
  
      // 🔴 Ce créneau est déjà réservé
      if (slotDate >= startTime && slotDate < endTime) {
        return true;
      }
  
      // 🔴 On doit griser les créneaux avant un film déjà réservé
      const beforeStart = new Date(startTime.getTime() - movie.runtime * 60000);
      return slotDate >= beforeStart && slotDate < startTime;
    });
  };
  
  

  const goToNextWeek = () => {
    const nextWeek = new Date(selectedDate);
    nextWeek.setDate(selectedDate.getDate() + 7);
    setSelectedDate(nextWeek);
  };

  const goToPreviousWeek = () => {
    const previousWeek = new Date(selectedDate);
    previousWeek.setDate(selectedDate.getDate() - 7);
    setSelectedDate(previousWeek);
  };

  const getOccupiedSlotInfo = (time, dayIndex) => {
    if (!reservations.length) return null;

    const slotDate = new Date(selectedDate);
    slotDate.setDate(selectedDate.getDate() - selectedDate.getDay() + 1 + dayIndex);

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

  const handleMouseEnter = (time, dayIndex, isDisabled, isPast) => {
    if (!movie?.runtime || isDisabled || isPast) return; // ❌ Ne rien faire si le créneau est grisé ou passé
  
    const slotDate = new Date(selectedDate);
    slotDate.setDate(selectedDate.getDate() - selectedDate.getDay() + 1 + dayIndex);
  
    const [hours, minutes] = time.split("h");
    slotDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
  
    setHoveredTime(slotDate);
  };
  
  const handleMouseLeave = () => {
    setHoveredTime(null);
  };
  
  

  const handleReservation = async (time, dayIndex) => {
    const token = getAuthToken();
    if (!token) {
      setMessage({ type: "danger", text: "Vous devez être connecté pour réserver." });
      return;
    }
  
    const reservationDate = new Date(selectedDate);
    reservationDate.setDate(selectedDate.getDate() - selectedDate.getDay() + 1 + dayIndex);
  
    const [hours, minutes] = time.split("h");
    reservationDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
  
    const formattedStartTime = reservationDate.toISOString();
  
    const reservationData = {
      movieId: parseInt(id, 10),
      startTime: formattedStartTime,
    };
  
    try {
      await axios.post("http://localhost:3000/reservations", reservationData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      setMessage({ type: "success", text: "Réservation réussie !" });
  
      // Redirection vers la page "Mes Réservations"
      navigate("/myreservation");
  
    } catch (error) {
      console.error("Erreur lors de la réservation :", error);
      setMessage({ type: "danger", text: "Erreur lors de la réservation, veuillez réessayer." });
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
    <div className="min-vh-100 pt-5">
      <Navigation />
      <Container className="text-center">
        <h2 className="my-4">Choisissez un créneau pour {movie?.title || "Chargement..."}</h2>

        {message && <Alert variant={message.type}>{message.text}</Alert>}

        <div className="d-flex justify-content-between align-items-center my-4">
          <Button variant="light" onClick={goToPreviousWeek}>&larr;</Button>
          <h3>{selectedDate.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</h3>
          <Button variant="light" onClick={goToNextWeek}>&rarr;</Button>
        </div>

        <div className="d-flex justify-content-around mt-4">
          {daysOfWeek.map((day, index) => {
            const dateObj = new Date(selectedDate);
            dateObj.setDate(selectedDate.getDate() - selectedDate.getDay() + 1 + index);
            return (
              <div key={index} className="text-center">
                <strong>{day} {dateObj.getDate()}</strong>
                <div className="d-flex flex-column align-items-center mt-2">
                {timeSlots.map((time, timeIndex) => {
                  const occupiedSlot = getOccupiedSlotInfo(time, index);

                  // Création de la date du créneau
                  const slotDate = new Date(dateObj);
                  const [hours, minutes] = time.split("h");
                  slotDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

                  const isPast = slotDate < new Date();
                  const isDisabled = isSlotDisabled(time, index);


                  // Vérifie si ce créneau est dans la plage occupée par le film
                  const isHoveredRange =
                    hoveredTime &&
                    movie?.runtime &&
                    slotDate >= hoveredTime &&
                    slotDate < new Date(hoveredTime.getTime() + movie.runtime * 60000);

                  return (
                    <OverlayTrigger
                      key={timeIndex}
                      placement="top"
                      overlay={(props) => (
                        occupiedSlot ? (
                          <Tooltip id={`tooltip-${timeIndex}`} {...props}>
                            {occupiedSlot.movieTitle}
                          </Tooltip>
                        ) : <span></span> // Evite un tooltip vide
                      )}
                    >
                    <Card
                      key={timeIndex}
                      className={`
                        mb-2
                        ${occupiedSlot ? "border-danger text-danger" : ""}
                        ${isPast || isDisabled ? "text-muted" : ""}
                      `}
                      style={{
                        cursor: isDisabled || isPast ? "not-allowed" : "pointer",
                        width: "80px",
                        backgroundColor: occupiedSlot
                          ? "#f8d7da" // 🔴 Rouge si réservé
                          : isHoveredRange 
                            ? "#cce5ff" // 🔵 Bleu clair si survolé (y compris les créneaux gris)
                            : isDisabled || isPast
                              ? "#e9ecef" // ⚪ Gris si bloqué (par un autre film)
                              : "transparent",
                        border: "1px solid #ccc",
                        opacity: isDisabled || isPast ? 0.5 : 1,
                      }}
                      onClick={!occupiedSlot && !isDisabled && !isPast ? () => handleReservation(time, index) : null}
                      onMouseEnter={() => handleMouseEnter(time, index, isDisabled, isPast)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <Card.Body className="p-1">
                        <Card.Text className="mb-0">{time}</Card.Text>
                      </Card.Body>
                    </Card>


                    </OverlayTrigger>
                  );
                })}
              </div>
              </div>
            );
          })}
        </div>
      </Container>
    </div>
  );
};

export default ReservationPage;
