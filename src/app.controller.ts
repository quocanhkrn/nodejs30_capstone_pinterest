import { Controller, Get, Param, Res } from '@nestjs/common';
import * as path from 'path';
import { AppService } from './app.service';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiExcludeEndpoint()
  @Get(':fileName')
  sendImage(@Param('fileName') fileName: string, @Res() res) {
    return res.sendFile(path.join(process.cwd(), 'public/imgs/' + fileName));
  }
}
