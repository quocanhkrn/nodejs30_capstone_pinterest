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
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { handleErr } from '../constants';

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
    const { password, is_remove, ...data } = req.user;
    let token: string = this.jwtService.sign({ data }, { algorithm: 'HS512' });
    return {
      message: 'Successfully signed in!',
      token,
    };
  }

  @Post('signup')
  async signUp(@Body() user: CreateUserDto) {
    try {
      const existedUser: User = await this.userService.findOneByEmail(
        user.email,
      );
      if (existedUser) {
        throw new HttpException('This email is already existed!', 400);
      } else {
        const createdUser: User = await this.authService.signUp(user);
        return {
          message: 'Successfully created new account!',
          data: createdUser,
        };
      }
    } catch (err) {
      handleErr(err);
    }
  }
}
