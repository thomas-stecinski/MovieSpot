import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('❌ Token manquant');
    }

    try {
      const payload = this.jwtService.verify(token);
      console.log('🛑 Token extrait:', token);
      console.log('🛑 Payload du JWT:', payload);
      
      if (!payload.sub) {
        throw new UnauthorizedException('❌ Token invalide: ID utilisateur manquant.');
      }
      
      request.user = payload; // ✅ Attache l'utilisateur à la requête
      return true;
    } catch (error) {
      throw new UnauthorizedException('❌ Token invalide');
    }
  }
}
