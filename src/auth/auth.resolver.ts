import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { EmailService } from 'src/email/email.service';
import { AuthTokens } from './auth-tokens.model';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly emailService: EmailService
  ) { }

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

  @Mutation(() => AuthTokens)
  async refreshTokens(@Context() ctx): Promise<AuthTokens> {
    const token = ctx.req.cookies['refresh_token'];
    if (!token) throw new Error('No refresh token');
    const tokens = await this.authService.refreshTokens(token);

    ctx.res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/graphql',
    });

    return tokens;
  }

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

  @Mutation(() => Boolean)
  async requestPasswordReset(@Args('email') email: string): Promise<boolean> {
    const user = await this.userService.findByEmail(email);
    if (!user) return true;

    const resetToken = randomBytes(32).toString('hex');
    const expireTime = new Date(Date.now() + 15 * 60 * 1000);
    await this.userService.setResetToken(user.id, await bcrypt.hash(resetToken, 10), expireTime);
    await this.emailService.sendResetEmail(user.email, resetToken);

    return true;
  }

  @Mutation(() => Boolean)
  async passwordReset(
    @Args('token') token: string,
    @Args('newPassword') newPassword: string
  ): Promise<boolean> {
    const user = await this.userService.findByValidResetToken(token);

    if (!user) {
      throw new Error("Invalid or expired reset token");
    }

    await this.userService.resetPassword(user.id, newPassword);
    return true;
  }



}
