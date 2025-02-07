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

  @Post()
  @ApiOperation({ summary: 'Créer une réservation (auth requis)' })
  @ApiBody({
    description: 'ID film et heure/date reservation',
    type: Object,
    examples: {
      example1: {
        summary: 'Exemple de réservation',
        value: {
          movieId: 920, 
          startTime: "2025-02-08T10:00:00Z", 
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Réservation créée avec succès.' })
  @ApiResponse({ status: 400, description: 'Cette horaire est déja pris' })
  async createReservation(
    @Req() req, 
    @Body() body: { movieId: number, startTime: string }
  ) {
    return this.reservationService.createReservation(req.user, body.movieId, new Date(body.startTime));
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer des réservations (Auth requis)' })
  @ApiResponse({ status: 200, description: 'Liste des réservations' })
  async getReservations(@Req() req) {
    return this.reservationService.getUserReservations(req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Annuler une réservation (Auth requis)' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID de la réservation à annuler', example: 1 })
  @ApiResponse({ status: 200, description: 'Réservation annulée avec succès.' })
  @ApiResponse({ status: 404, description: 'Réservation introuvable.' })
  async cancelReservation(@Req() req, @Param('id') id: number) {
    return this.reservationService.cancelReservation(req.user, id);
  }
}
