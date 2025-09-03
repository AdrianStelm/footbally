import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/user/user.graphql.model';

@ObjectType()
export class News {
    @Field()
    id: string

    @Field()
    title: string

    @Field()
    text: string

    @Field(() => User)
    author: User


    @Field(() => Date)
    createdAt: Date

    @Field(() => Date)
    updatedAt: Date

    @Field()
    slug: string;

    @Field(() => String, { nullable: true })
    imageUrl?: string | null;
}