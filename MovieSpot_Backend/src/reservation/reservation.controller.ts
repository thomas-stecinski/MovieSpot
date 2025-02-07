import { Controller, Post, Get, Delete, Param, UseGuards, Req, Body } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';

@ApiTags('Reservations') 
@ApiBearerAuth() 
@Controller('reservations')
@UseGuards(JwtAuthGuard) 
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  /**
   * ✅ Créer une réservation
   */
  @Post()
  @ApiOperation({ summary: 'Créer une réservation (🔐 Authentification requise)' })
  @ApiBody({
    description: 'ID du film et heure du créneau pour la réservation',
    type: Object,
    examples: {
      example1: {
        summary: 'Exemple de réservation',
        value: {
          movieId: 920, // ID du film pour le test
          startTime: "2024-12-15T10:00:00Z", // Heure du créneau
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Réservation créée avec succès.' })
  @ApiResponse({ status: 400, description: 'Conflit de réservation (film déjà réservé à cet horaire).' })
  async createReservation(
    @Req() req, 
    @Body() body: { movieId: number, startTime: string } // Entrée simplifiée : ID du film et heure du créneau
  ) {
    return this.reservationService.createReservation(req.user, body.movieId, new Date(body.startTime));
  }

  /**
   * ✅ Lister les réservations de l'utilisateur
   */
  @Get()
  @ApiOperation({ summary: 'Récupérer ses réservations (🔐 Authentification requise)' })
  @ApiResponse({ status: 200, description: 'Liste des réservations récupérée avec succès.' })
  async getReservations(@Req() req) {
    return this.reservationService.getUserReservations(req.user);
  }

  /**
   * ✅ Annuler une réservation
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Annuler une réservation (🔐 Authentification requise)' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID de la réservation à annuler', example: 1 })
  @ApiResponse({ status: 200, description: 'Réservation annulée avec succès.' })
  @ApiResponse({ status: 404, description: 'Réservation introuvable.' })
  async cancelReservation(@Req() req, @Param('id') id: number) {
    return this.reservationService.cancelReservation(req.user, id);
  }
}
