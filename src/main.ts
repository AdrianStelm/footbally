/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';
import cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  const prismaService = app.get(PrismaService);
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true
  })
  await app.listen(4000);
}
bootstrap();
