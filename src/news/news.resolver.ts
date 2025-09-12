import { Resolver, Query, Mutation, Args, ResolveField, Parent, Int } from '@nestjs/graphql';
import type { FileUpload } from 'graphql-upload-minimal';
import { GraphQLUpload } from 'graphql-upload-minimal';
import { NewsService } from './news.service';
import { News } from './dto/news.dto';
import { CreateArticleDto, UpdateArticleInput } from './dto/create-article.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/user/role.enum';
import { UseGuards } from '@nestjs/common';
import { NewsPaginationArgs } from './news-pagination.args';
import { NewsPaginationResponse } from './dto/news-pagination-response.dto';
import { CreateLikeInput } from './dto/news-likes.dto';
import { SearchArticle } from './dto/search-article.dto';

@Resolver(() => News)
export class NewsResolver {
  constructor(private readonly newsService: NewsService) { }

  @Query(() => [News])
  async getAllArticles(): Promise<News[]> {
    return this.newsService.getArticles()
  }

  @Query(() => [News])
  async getNewestArticles(): Promise<News[]> {
    return this.newsService.getArticles({
      take: 7,
      skip: 0,
    });
  }

  @Query(() => News)
  async getArticle(@Args('id') id: string): Promise<News | null> {
    return this.newsService.getById(id)
  }


  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Mutation(() => News)
  async createArticle(
    @Args('data') data: CreateArticleDto,
    @CurrentUser('sub') userId: string,
    @Args({ name: 'files', type: () => [GraphQLUpload], nullable: true })
    files?: Promise<FileUpload>[],
  ): Promise<News> {
    return this.newsService.create(data, userId, files);
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

  @Query(() => [News])
  async loadMoreArticles(
    @Args('skip', { type: () => Int, nullable: true }) skip?: number,
    @Args('take', { type: () => Int, nullable: true }) take?: number,
  ): Promise<News[]> {
    return this.newsService.getArticles({
      skip,
      take,
    });
  }

  @Query(() => [News])
  async getTopLikedLast7Days(): Promise<News[]> {
    return this.newsService.getTopLikedLast7Days();
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Query(() => [News])
  async getArticlesByAuthor(@CurrentUser('sub') userId: string) {
    return this.newsService.getArticlesByAuthorSimple(userId);
  }

  @Query(() => [SearchArticle])
  async searchArticles(
    @Args('query') query: string,
  ): Promise<SearchArticle[]> {
    return this.newsService.searchArticles(query);
  }



}
