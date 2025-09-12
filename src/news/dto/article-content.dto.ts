import { ObjectType, InputType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class ArticleContent {
    @Field()
    id: string;

    @Field(() => String, { nullable: true })
    imageUrl?: string | null;

    @Field(() => String, { nullable: true })
    videoUrl?: string | null;

    @Field(() => Int)
    order: number;

    @Field(() => String)
    content: string
}

@InputType()
export class ArticleContentInput {
    @Field()
    content: string;

    @Field(() => String, { nullable: true })
    imageUrl?: string;

    @Field(() => String, { nullable: true })
    videoUrl?: string;

    @Field(() => Int)
    order: number;
}
