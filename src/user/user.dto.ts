import { MinLength, isEnum, isEmail } from "@nestjs/class-validator";
import { PartialType } from '@nestjs/mapped-types';
import { Role as PrismaRole } from '@prisma/client';

export class UserDto {

  email: string;

  @MinLength(5)  
  username: string;

  @MinLength(5)  
  password: string;

  role: PrismaRole;
}

export class UpdateUserDto extends PartialType(UserDto) {}