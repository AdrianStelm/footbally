import { ObjectType, PickType } from '@nestjs/graphql';
import { News } from './news.dto';


@ObjectType()
export class SearchArticle extends PickType(News, [
    'id',
    'title',
    'slug'
] as const) {
}
