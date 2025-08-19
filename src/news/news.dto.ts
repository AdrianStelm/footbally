import { MinLength, IsString } from '@nestjs/class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateArticleDto {
  @MinLength(5)
  @IsString()
  title: string;

  @IsString()
  text: string;

  @IsString()
  authorId: string;
}

export class UpdateArticleDto extends PartialType(CreateArticleDto) { }
