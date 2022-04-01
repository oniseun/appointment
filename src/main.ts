import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
const isProd = process.env.NODE_ENV === 'production' 
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    methods: ['GET','POST'],
    credentials: isProd
  });
  app.use(helmet({
    contentSecurityPolicy:
      isProd ? undefined : false,
  }));

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
