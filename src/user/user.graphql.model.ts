import { Field, ObjectType, InputType, PartialType, registerEnumType } from "@nestjs/graphql";
import { Role as PrismaRole } from '@prisma/client';

registerEnumType(PrismaRole,{name:'Role'});

@ObjectType()
export class User{
    @Field()
    email:string

    @Field()
    password:string

    @Field()
    username:string

    @Field(() => PrismaRole) 
    role: PrismaRole;
}

@InputType()
export class CreateUser{
    @Field()
    email:string

    @Field()
    password:string

    @Field()
    username:string

    @Field(() => PrismaRole, { defaultValue: PrismaRole.USER }) 
    role: PrismaRole;
}

@InputType()
export class UpdateUser extends PartialType(CreateUser){}

