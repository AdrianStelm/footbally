import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt.guard';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'jwtsecret',
    });
  }

  validate(payload: JwtPayload) {
    console.log('>>> JwtStrategy.validate payload:', payload);

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
