import { ObjectType, Field, Int } from '@nestjs/graphql';
import { News } from './news.model';

@ObjectType()
export class NewsPaginationResponse {
    @Field(() => [News])
    items: News[];

    @Field(() => Int)
    totalItems: number;

    @Field(() => Int)
    totalPages: number;

    @Field(() => Int)
    currentPage: number;
}
