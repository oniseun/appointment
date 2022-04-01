import { Injectable } from '@nestjs/common';
import { Health } from './health.model';

@Injectable()
export class AppService {
  getHealth(): Health {
    return {
      success: true,
      message: "Hello there! I'm OK!",
    };
  }
}
