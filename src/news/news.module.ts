import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsResolver } from './news.resolver';
import { PrismaModule } from '../prisma.module';


@Module({
  imports:[PrismaModule],
  providers: [NewsResolver, NewsService],
})
export class NewsModule {}
