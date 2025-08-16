import { ObjectType, Field } from "@nestjs/graphql";


@ObjectType()
export class AuthTokens {
    @Field()
    access_token: string;

    @Field()
    refresh_token: string;

    @Field()
    userId: string

}
