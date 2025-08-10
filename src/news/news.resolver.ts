import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { NewsService } from './news.service';
import { News } from './news.model';
import { CreateArticleDto, UpdateArticleInput } from './createArticle.model';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';

@Resolver(() => News)
export class NewsResolver {
  constructor(private readonly newsService: NewsService) {}

  @Query(() => News)
  async getAllArticles():Promise<News[]>{
    return this.newsService.getAll()
  }

  @Query(() => News)
  async getArticle(@Args('id') id:string):Promise<News | null>{
    return this.newsService.getById(id)
  }

  @UseGuards(RolesGuard,GqlAuthGuard)
  @Roles('ADMIN','USER')
  @Mutation(() => News)
  async createArticle(@Args('data') data:CreateArticleDto):Promise<News>{
    return this.newsService.create(data)
  }

  @UseGuards(RolesGuard,GqlAuthGuard)
  @Roles('ADMIN','USER')
  @Mutation(() => Boolean)
  async deleteArticle(@Args('id') id:string):Promise<boolean>{
    await this.newsService.deleteById(id)
    return true
  }

  @UseGuards(RolesGuard,GqlAuthGuard)
  @Roles('ADMIN','USER')
  @Mutation(() => News)
  async changeArticle(@Args('id') id:string, @Args('data') data:UpdateArticleInput):Promise<News>{
    return this.newsService.changeById(id,data)
  }
}
