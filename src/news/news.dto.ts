import { MinLength } from "@nestjs/class-validator";

export class ArticleDto {
  @MinLength(5)  
  title: string;
  text: string;
  author: string;
}
