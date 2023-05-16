import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SignInStrategy } from './strategies/signin.strategy';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtContants } from './contants';

@Module({
  imports: [PassportModule, JwtModule.register({ secret: jwtContants.secret })],
  controllers: [AuthController],
  providers: [AuthService, UsersService, SignInStrategy],
})
export class AuthModule {}
