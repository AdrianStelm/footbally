import { ObjectType, Field, ID, InputType } from "@nestjs/graphql";
import { News } from "./news.dto";
import { User } from "src/user/dto/user.dto";

@ObjectType()
export class Like {
    @Field(() => ID)
    id: string

    @Field(() => User)
    author: User

    @Field(() => News)
    article: News
}

@InputType()
export class CreateLikeInput {
    @Field(() => ID)
    articleId: string;
}