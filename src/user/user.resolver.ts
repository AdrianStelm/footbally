import { CreateUser, UpdateUser, User } from './dto/user.dto';
import { UserService } from './user.service';
import { Query, Mutation, Args, Resolver, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuthTokens } from 'src/auth/dto/auth-tokens.dto';
import { AuthService } from 'src/auth/auth.service';
import { Response } from 'express';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { Role } from './role.enum';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { EmailService } from 'src/email/email.service';
import * as bcrypt from 'bcrypt'

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService, private readonly authService: AuthService, private readonly emailService: EmailService) { }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Query(() => [User])
  async getAllUsers(): Promise<User[] | null> {
    return await this.userService.getAll()
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Query(() => User)
  async getUserByEmail(@Args('email') email: string): Promise<User | null> {
    return await this.userService.findByEmail(email)
  }

  @Mutation(() => AuthTokens)
  async createUser(
    @Args('data') data: CreateUser,
    @Context() context: { res: Response }
  ): Promise<AuthTokens> {
    const user = await this.userService.create(data);
    const tokens = await this.authService.login(user);

    context.res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return tokens;
  }


  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Mutation(() => User)
  async updateUser(@CurrentUser('sub') userId: string, @Args('data') data: UpdateUser): Promise<User> {
    return await this.userService.updateById(userId, data)
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Mutation(() => Boolean)
  async deleteUser(@Args('id') id: string): Promise<boolean> {
    await this.userService.deleteById(id)
    return true
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Mutation(() => Boolean)
  async changePassword(@CurrentUser('sub') userId: string, @Args('inputedPassword') inputedPassword: string, @Args('newPassword') newPassword: string): Promise<boolean> {
    await this.userService.changePassword(userId, newPassword, inputedPassword,)
    return true
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Mutation(() => Boolean)
  async requestEmailChange(
    @CurrentUser('sub') userId: string,
    @Args('newEmail') newEmail: string,
  ): Promise<boolean> {
    const token = Math.random().toString(16).slice(2);
    const hashedToken = await bcrypt.hash(token, 10);
    const expireTime = new Date(Date.now() + 1000 * 60 * 30);

    await this.userService.setEmailChangeToken(userId, newEmail, hashedToken, expireTime);

    await this.emailService.sendEmailChangeConfirmation(newEmail, token);

    return true;
  }

  @Mutation(() => Boolean)
  async confirmEmailChange(
    @Args('token') token: string
  ): Promise<boolean> {
    return await this.userService.confirmEmailChange(token);
  }



}