import { InputType, Field} from '@nestjs/graphql';
import { PartialType } from '@nestjs/graphql';

@InputType()
export class CreateArticleDto {
  @Field()
  title: string;

  @Field()
  text: string;

  @Field()
  author: string;
}

@InputType()
export class UpdateArticleInput extends PartialType(CreateArticleDto) {}