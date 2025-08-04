import { InputType, Field} from '@nestjs/graphql';

@InputType()
export class CreateArticleDto {
  @Field()
  title: string;

  @Field()
  text: string;

  @Field()
  author: string;
}
