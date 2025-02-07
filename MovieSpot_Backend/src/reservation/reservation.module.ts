import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { Reservation } from './entities/reservation.entity';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module'; // ✅ Ajout du module Auth

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, User]),
    UserModule,
    AuthModule, // ✅ Ajout de AuthModule pour éviter l'erreur de dépendance sur JwtService
  ],
  controllers: [ReservationController],
  providers: [ReservationService],
  exports: [ReservationService],
})
export class ReservationModule {}
