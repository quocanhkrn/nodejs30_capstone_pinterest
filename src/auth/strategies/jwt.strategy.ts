import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtContants } from '../contants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'local') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromHeader('token'),
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtContants.secret,
    });
  }

  async validate(decodedToken: any) {
    return decodedToken;
  }
}
