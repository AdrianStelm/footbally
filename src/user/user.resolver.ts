import { CreateUser, UpdateUser, User } from './user.graphql.model';
import { UserService } from './user.service';
import { Query, Mutation, Args, Resolver, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { AuthTokens } from 'src/auth/auth-tokens.model';
import { AuthService } from 'src/auth/auth.service';
import { Response } from 'express';


@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService, private readonly authService: AuthService) { }

  @UseGuards(RolesGuard, GqlAuthGuard)
  @Roles('ADMIN')
  @Query(() => [User])
  async getAllUsers(): Promise<User[] | null> {
    return await this.userService.getAll()
  }

  @UseGuards(RolesGuard, GqlAuthGuard)
  @Roles('ADMIN')
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


  @UseGuards(RolesGuard, GqlAuthGuard)
  @Roles('ADMIN', 'USER')
  @Mutation(() => User)
  async updateUser(@Args('id') id: string, @Args('data') data: UpdateUser): Promise<User> {
    return await this.userService.updateById(id, data)
  }

  @UseGuards(RolesGuard, GqlAuthGuard)
  @Roles('ADMIN', 'USER')
  @Mutation(() => Boolean)
  async deleteUser(@Args('id') id: string): Promise<boolean> {
    await this.userService.deleteById(id)
    return true
  }
}