import {
  Controller,
  Post,
  Body,
  InternalServerErrorException,
  Request,
  UseGuards,
  HttpException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport/dist';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @UseGuards(AuthGuard('sign-in'))
  @Post('signin')
  signIn(@Request() req) {
    let token = this.jwtService.sign(req.user, { algorithm: 'HS512' });
    return {
      message: 'Successfully signed in!',
      token,
    };
  }

  @Post('signup')
  async signUp(@Body() user: CreateUserDto) {
    try {
      let existedUser = await this.userService.findOneByEmail(user.email);
      if (existedUser) {
        throw new HttpException('This email is already existed!', 400);
      } else {
        let createdUser = await this.authService.signUp(user);
        return {
          message: 'Successfully created new account!',
          data: createdUser,
        };
      }
    } catch (err) {
      if (err) {
        throw err;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
