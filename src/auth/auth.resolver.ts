import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { EmailService } from 'src/email/email.service';
import { AuthTokens } from './dto/auth-tokens.dto';
import { randomBytes } from 'crypto';
import { JwtGuard } from '../common/guards/jwt.guard';
import { UseGuards } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/user/role.enum';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Response, Request } from 'express';
import { OAuth2Client } from 'google-auth-library';

@Resolver()
export class AuthResolver {
  private googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly emailService: EmailService
  ) { }

  @Mutation(() => AuthTokens)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
    @Context() ctx: { req: Request; res: Response }
  ): Promise<AuthTokens> {
    const user = await this.authService.validateUser(email, password);
    if (!user) throw new Error('Invalid credentials');

    const tokens = await this.authService.login(user);

    ctx.res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/graphql',
    });

    return tokens;
  }


  @Mutation(() => AuthTokens, { nullable: true })
  async refreshTokens(
    @Context() ctx: { req: Request; res: Response }
  ): Promise<AuthTokens | null> {
    const tokenFromCookie: unknown = ctx.req.cookies['refresh_token'];
    const token: string | undefined = typeof tokenFromCookie === 'string' ? tokenFromCookie : undefined;

    if (!token) return null;

    const tokens = await this.authService.refreshTokens(token);

    if (!tokens) return null;

    ctx.res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/graphql',
    });

    return tokens;
  }



  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Mutation(() => Boolean)
  async logout(@Args('userId') userId: string, @Context() ctx: { req: Request; res: Response }): Promise<boolean> {
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

    const resetToken: string = randomBytes(32).toString('hex');
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

  @Mutation(() => AuthTokens)
  async googleLogin(
    @Args('idToken') idToken: string,
    @Context() ctx: { res: Response },
  ): Promise<AuthTokens> {
    const ticket = await this.googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email) {
      throw new Error('Google login failed');
    }

    const user = await this.authService.validateGoogleUser({
      email: payload.email,
      username: payload.name || payload.email.split('@')[0],
    });

    const tokens = await this.authService.login(user);

    ctx.res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/graphql',
    });

    return tokens;
  }



}
