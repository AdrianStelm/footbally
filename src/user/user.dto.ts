import { MinLength, IsEmail } from "@nestjs/class-validator";
import { PartialType } from '@nestjs/mapped-types';
import { Role as PrismaRole } from '@prisma/client';

export class UserDto {

  @IsEmail()
  email: string;

  @MinLength(5)
  username: string;

  @MinLength(5)
  password: string;

  role: PrismaRole;
}

export class UpdateUserDto extends PartialType(UserDto) { }