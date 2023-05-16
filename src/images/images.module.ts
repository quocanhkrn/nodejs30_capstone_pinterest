import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtContants } from 'src/auth/contants';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';

@Module({
  imports: [PassportModule, JwtModule.register({ secret: jwtContants.secret })],
  controllers: [ImagesController],
  providers: [ImagesService, JwtStrategy],
})
export class ImagesModule {}
