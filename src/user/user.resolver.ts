import { CreateUser, UpdateUser, User } from './user.graphql.model';
import { UserService } from './user.service';
import { Query, Mutation, Args, Resolver} from '@nestjs/graphql';


@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  async getAllUsers():Promise<User[] | null>{
      return await this.userService.getAll()
  }

  @Query(() => User)
  async getUser(@Args('id') id:string):Promise<User| null>{
      return await this.userService.getOneById(id)
  }

  @Mutation(() => User)
  async createUser(@Args('data') data:CreateUser):Promise<User>{
      return await this.userService.create(data)
  }

  @Mutation(() => User)
  async updateUser(@Args('id') id:string, @Args('data') data:UpdateUser):Promise<User>{
      return await this.userService.updateById(id,data)
  }

  @Mutation(() => Boolean)
  async deleteUser(@Args('id') id:string):Promise<boolean>{
    await this.userService.deleteById(id)
    return true
  }
}