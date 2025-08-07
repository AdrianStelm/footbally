import { CreateUser, UpdateUser, User } from './user.graphql.model';
import { UserService } from './user.service';
import { Query, Mutation, Args, Resolver, Context} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';


@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}
  @UseGuards(GqlAuthGuard)
  @Query(() => [User])
  async getAllUsers():Promise<User[] | null>{
      return await this.userService.getAll()
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => User)
  async getUserByEmail(@Args('email') email:string):Promise<User| null>{
      return await this.userService.findByEmail(email)
  }

  @Mutation(() => User)
  async createUser(@Args('data') data:CreateUser):Promise<User>{
      return await this.userService.create(data)
  }

  @Mutation(() => User)
  async updateUser(@Args('id') id:string, @Args('data') data:UpdateUser):Promise<User>{
      return await this.userService.updateById(id,data)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async deleteUser(@Args('id') id:string):Promise<boolean>{
    await this.userService.deleteById(id)
    return true
  }
}