import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { NewsService } from './news.service';
import { News } from './news.model';
import { CreateArticleDto } from './createArticle.model';

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

  @Mutation(() => News)
  async createArticle(@Args('data') data:CreateArticleDto):Promise<News>{
    return this.newsService.create(data)
  }
}
