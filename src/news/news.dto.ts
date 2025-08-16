import { MinLength, IsString } from '@nestjs/class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class ArticleDto {
  @MinLength(5)
  @IsString()
  title: string;

  @IsString()
  text: string;

  @IsString()
  author: string;
}

export class UpdateArticleDto extends PartialType(ArticleDto) { }
