import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module'; 
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Module({
  imports: [HttpModule, ConfigModule, AuthModule], 
  controllers: [MoviesController],
  providers: [MoviesService, JwtAuthGuard],
})
export class MoviesModule {}
