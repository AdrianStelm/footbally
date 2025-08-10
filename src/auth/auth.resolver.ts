import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import  * as bcrypt  from  'bcrypt'

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService, private readonly userService: UserService,) {}

  @Mutation(() => String)
  async login(@Args('email') email:string, @Args('password') password:string){

    const user = await this.authService.ValidateUser(email,password)
    
    if (!user) throw new Error('Invalid credentials')
    const token = await this.authService.login(user)
    return token.acces_token
  }

  @Mutation(() => Boolean)
  async retrievePassword(@Args('newPassword') newPassword:string, @Args('email') email:string){

    const user = await this.userService.findByEmail(email)
    if (!user) return false

    const hashPassword = await bcrypt.hash(newPassword,10)
    await this.userService.updatePassword(email,hashPassword)
    return true
  }


}
