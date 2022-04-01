import { Controller, Get } from '@nestjs/common';
import { Health } from './health.model';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly service: AppService) {}

  @Get()
  index(): Health {
    return this.service.getHealth();
  }

  @Get('/health')
  getHealth(): Health {
    return this.index();
  }
}
