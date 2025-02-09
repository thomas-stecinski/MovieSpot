import axios from 'axios';
import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { User } from '../user/entities/user.entity';
import { LessThan, MoreThan } from 'typeorm';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createReservation(userPayload: { sub: number }, movieId: number, startTime: Date) {
    const user = await this.userRepository.findOne({ where: { id: userPayload.sub } });
    
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    
    let movieTitle: string;
    let movieRuntime: number;
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
        params: {
          api_key: process.env.TMDB_API_KEY,
        },
      });

      movieTitle = response.data.title;
      movieRuntime = response.data.runtime;
    } catch (error) {
      throw new NotFoundException('Impossible de récupérer les informations du film depuis TMDb');
    }

    if (!movieRuntime) {
      throw new BadRequestException('Durée du film introuvable');
    }

    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + movieRuntime);

    const conflictingReservation = await this.reservationRepository.findOne({
      where: { 
        user,
        startTime: LessThan(endTime),
        endTime: MoreThan(startTime),
      },
    });

    if (conflictingReservation) {
      throw new BadRequestException('film est déjà réservé à cet horaire');
    }

    const reservation = this.reservationRepository.create({
      user,
      movieId,
      movieTitle,
      startTime,
      endTime,
    });

    return await this.reservationRepository.save(reservation);
  }

  async getUserReservations(userPayload: { sub: number }) {
    const user = await this.userRepository.findOne({ where: { id: userPayload.sub } });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return await this.reservationRepository.find({ where: { user } });
  }
  
  async cancelReservation(userPayload: { sub: number }, id: number) {
    const user = await this.userRepository.findOne({ where: { id: userPayload.sub } });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const reservation = await this.reservationRepository.findOne({ where: { id, user } });

    if (!reservation) {
      throw new NotFoundException('Réservation introuvable');
    }

    await this.reservationRepository.remove(reservation);
    return { message: 'Réservation annulée avec succès' };
  }
}
