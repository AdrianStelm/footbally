import { InputType, Field } from '@nestjs/graphql';
import { PartialType } from '@nestjs/graphql';
import { ArticleContentInput } from './article-content.dto';

@InputType()
export class CreateArticleDto {
  @Field()
  title: string;

  @Field(() => [ArticleContentInput])
  content: ArticleContentInput[];

}

@InputType()
export class UpdateArticleInput extends PartialType(CreateArticleDto) { }