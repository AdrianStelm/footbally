import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { Comment } from './dto/comment.dto';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UseGuards } from '@nestjs/common';
import { User } from 'src/user/dto/user.dto';
import { News } from 'src/news/dto/news.dto';
import { CreateCommentInput } from './dto/comment.dto';

@Resolver(() => Comment)
export class CommentResolver {
  constructor(private readonly commentService: CommentService) { }

  @UseGuards(JwtGuard)
  @Mutation(() => Comment)
  async addComment(
    @Args('data') data: CreateCommentInput,
    @CurrentUser('sub') userId: string,
  ): Promise<Comment> {
    return this.commentService.create(data, userId);
  }

  @Query(() => [Comment])
  async commentsByArticle(
    @Args('articleId') articleId: string,
  ): Promise<Comment[]> {
    return this.commentService.findByArticle(articleId);
  }

  @UseGuards(JwtGuard)
  @Mutation(() => Boolean)
  async deleteComment(
    @Args('id') id: string,
    @CurrentUser('sub') userId: string,
  ): Promise<boolean> {
    await this.commentService.remove(id, userId);
    return true;
  }

  @ResolveField(() => User)
  async author(@Parent() comment: Comment) {
    return this.commentService.getAuthor(comment.id);
  }

  @ResolveField(() => News)
  async article(@Parent() comment: Comment) {
    return this.commentService.getArticle(comment.id);
  }
}
