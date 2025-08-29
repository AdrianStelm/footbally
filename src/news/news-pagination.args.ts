import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Min, IsString, IsOptional } from 'class-validator';

@ArgsType()
export class NewsPaginationArgs {
    @Field(() => Int)
    @Min(1)
    page: number;

    @Field(() => Int)
    @Min(1)
    limit: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    author?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    search?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    sort?: string;
}
