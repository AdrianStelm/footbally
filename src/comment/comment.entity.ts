import { ObjectType, Field, ID, InputType } from '@nestjs/graphql';
import { User } from 'src/user/user.graphql.model';
import { News } from 'src/news/news.model';

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
