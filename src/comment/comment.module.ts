import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentResolver } from './comment.resolver';
import { PrismaModule } from 'src/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CommentResolver, CommentService],
})
export class CommentModule { }
