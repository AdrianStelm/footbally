/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';
import cookieParser from 'cookie-parser';
import { graphqlUploadExpress } from 'graphql-upload-minimal';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.use(graphqlUploadExpress({ maxFileSize: 50000000, maxFiles: 2 }));
  const prismaService = app.get(PrismaService);
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true
  })
  await app.listen(4000);
}
bootstrap();
