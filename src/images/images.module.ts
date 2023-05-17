import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';

@Module({
  imports: [PassportModule],
  controllers: [ImagesController],
  providers: [ImagesService, JwtStrategy],
})
export class ImagesModule {}
