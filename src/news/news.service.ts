import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {Article} from '@prisma/client'
import { ArticleDto } from './news.dto';

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) {}

async create(dto: ArticleDto): Promise<Article> {
  return await this.prisma.article.create({
    data: dto,
  });
}
 async getAll():Promise<Article[]>{
  return await this.prisma.article.findMany({take: 5})  
 }

 async getById(id:string):Promise<Article | null>{
    return await this.prisma.article.findFirst({where: {id}})
 }

}