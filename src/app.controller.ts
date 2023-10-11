import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('pdf')
  genpdf(@Res({ passthrough: true }) res: Response) {
    return this.appService.genpdf(res);
  }

  @Get('pdf-table')
  genpdfTable(@Res({ passthrough: true }) res: Response) {
    return this.appService.genpdfTable(res);
  }

  @Get('pdf-jpg')
  genpdfImg(@Res({ passthrough: true }) res: Response) {
    return this.appService.genpdfImg(res);
  }

  @Get('pdf-mix')
  genpdfMix(@Res({ passthrough: true }) res: Response) {
    return this.appService.genpdfMix(res);
  }
}
