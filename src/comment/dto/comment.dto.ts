import { ObjectType, Field, ID, InputType } from '@nestjs/graphql';
import { User } from 'src/user/dto/user.dto';
import { News } from 'src/news/dto/news.dto';

@ObjectType()
export class Comment {
    @Field(() => ID)
    id: string;

    @Field()
    text: string;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;

    @Field(() => User)
    author: User;

    @Field(() => News)
    article: News;
}

@InputType()
export class CreateCommentInput {
    @Field()
    text: string;

    @Field()
    articleId: string;
}

@InputType()
export class UpdateCommentInput {
    @Field()
    id: string;

    @Field()
    text: string;
}
