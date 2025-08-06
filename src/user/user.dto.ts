import { MinLength } from "@nestjs/class-validator";
import { PartialType } from '@nestjs/mapped-types';

export class UserDto {
  
  email: string;

  @MinLength(5)  
  username: string;

  @MinLength(5)  
  password: string;
}

export class UpdateUserDto extends PartialType(UserDto) {}