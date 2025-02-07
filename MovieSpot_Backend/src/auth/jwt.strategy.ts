import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private jwtService: JwtService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),  // Extrait le token du header Authorization
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,  // Utilise la clé secrète depuis .env
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
