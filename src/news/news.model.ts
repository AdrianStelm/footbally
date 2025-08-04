import { ObjectType, Field} from '@nestjs/graphql';

@ObjectType()
export class News{
    @Field()
    id: string

    @Field()
    title:string

    @Field()
    text:string

    @Field()
    author:string

    @Field(() => Date)
    createdAt:Date

    @Field(() => Date)
    updatedAt:Date
}