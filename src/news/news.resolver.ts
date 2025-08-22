import { Resolver, Query, Mutation, Args, ResolveField, Parent, Int } from '@nestjs/graphql';
import { NewsService } from './news.service';
import { News } from './news.model';
import { CreateArticleDto, UpdateArticleInput } from './createArticle.model';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtGuard } from 'src/auth/jwt.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from '@prisma/client';
import { UseGuards } from '@nestjs/common';
import { NewsPaginationArgs } from './news-pagination.args';
import { NewsPaginationResponse } from './news-pagination.response';
import { CreateLikeInput } from './news-likes.entity';

@Resolver(() => News)
export class NewsResolver {
  constructor(private readonly newsService: NewsService) { }

  @Query(() => [News])
  async getAllArticles(): Promise<News[]> {
    return this.newsService.getArticles()
  }

  @Query(() => [News])
  async getNewestArticles(): Promise<News[]> {
    return this.newsService.getArticles({ orderBy: { createdAt: 'desc' } })
  }

  @Query(() => News)
  async getArticle(@Args('id') id: string): Promise<News | null> {
    return this.newsService.getById(id)
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Mutation(() => News)
  async createArticle(@Args('data') data: CreateArticleDto): Promise<News> {
    return this.newsService.create(data)
  }

  @Query(() => NewsPaginationResponse)
  async news(
    @Args() args: NewsPaginationArgs,
  ): Promise<NewsPaginationResponse> {
    return this.newsService.findAll(args);
  }

  @Query(() => News, { nullable: true })
  async getArticleBySlug(@Args('slug') slug: string): Promise<News | null> {
    return this.newsService.getBySlug(slug);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Mutation(() => Boolean)
  async deleteArticle(@Args('id') id: string, @CurrentUser('sub') userId: string) {
    await this.newsService.deleteById(id, userId);
    return true;
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Mutation(() => News)
  async changeArticle(
    @Args('id') id: string,
    @Args('data') data: UpdateArticleInput,
    @CurrentUser('sub') userId: string,
  ) {
    return this.newsService.changeById(id, data, userId);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Mutation(() => News)
  async LikeArticle(@Args('data') data: CreateLikeInput, @CurrentUser('sub') userId: string) {
    return this.newsService.toggleLike(userId, data.articleId)
  }


  @ResolveField(() => Int)
  async likesCount(@Parent() article: News): Promise<number> {
    return this.newsService.countLikes(article.id);
  }

  @Query(() => NewsPaginationResponse)
  async articlesPaginated(
    @Args() args: NewsPaginationArgs,
  ): Promise<NewsPaginationResponse> {
    const result = await this.newsService.findAll(args);
    return {
      items: result.items,
      totalItems: result.totalItems,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
    };
  }

}
