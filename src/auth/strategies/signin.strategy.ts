import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { handleErr } from '../../constants';

@Injectable()
export class SignInStrategy extends PassportStrategy(Strategy, 'sign-in') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string) {
    try {
      let authorizedUser = this.authService.validateUser({ email, password });
      if (authorizedUser) {
        return authorizedUser;
      } else {
        throw new UnauthorizedException();
      }
    } catch (err) {
      handleErr(err);
    }
  }
}
