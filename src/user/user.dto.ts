import { MinLength, IsEmail } from "@nestjs/class-validator";
import { PartialType } from '@nestjs/mapped-types';

export class UserDto {

  @IsEmail()
  email: string;

  @MinLength(5)
  username: string;

  @MinLength(5)
  password: string;

  role: string;
}

export class UpdateUserDto extends PartialType(UserDto) { }