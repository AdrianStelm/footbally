import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { AuthTokens } from './auth-tokens.model';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) { }

  // Логін
  @Mutation(() => AuthTokens)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
    @Context() ctx
  ): Promise<AuthTokens> {
    const user = await this.authService.validateUser(email, password);
    if (!user) throw new Error('Invalid credentials');

    const tokens = await this.authService.login(user);

    // Встановлюємо refresh token у cookie
    ctx.res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/graphql',
    });

    return tokens;
  }

  // Оновлення токенів через cookie
  @Mutation(() => AuthTokens)
  async refreshTokens(@Context() ctx): Promise<AuthTokens> {
    const token = ctx.req.cookies['refresh_token'];
    if (!token) throw new Error('No refresh token');
    const tokens = await this.authService.refreshTokens(token);

    // Оновлюємо cookie
    ctx.res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/graphql',
    });

    return tokens;
  }

  // Логаут
  @Mutation(() => Boolean)
  async logout(@Args('userId') userId: string, @Context() ctx): Promise<boolean> {
    await this.userService.clearRefreshToken(userId);
    ctx.res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    return true;
  }
}
