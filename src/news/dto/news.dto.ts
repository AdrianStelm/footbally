import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/user/dto/user.dto';
import { ArticleContent } from './article-content.dto';

@ObjectType()
export class News {
    @Field()
    id: string

    @Field()
    title: string

    @Field(() => User)
    author: User

    @Field(() => Date)
    createdAt: Date

    @Field(() => Date)
    updatedAt: Date

    @Field()
    slug: string;

    @Field(() => [ArticleContent], { nullable: true })
    content?: ArticleContent[];


}