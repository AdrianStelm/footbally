import { Field, ObjectType, InputType, PartialType } from "@nestjs/graphql";

@ObjectType()
export class User{
    @Field()
    email:string

    @Field()
    password:string

    @Field()
    username:string
}

@InputType()
export class CreateUser{
    @Field()
    email:string

    @Field()
    password:string

    @Field()
    username:string
}

@InputType()
export class UpdateUser extends PartialType(CreateUser){}

