import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '2h' },
      }),
    }),
    forwardRef(() => UserModule),
  ],
  providers: [AuthService, AuthResolver, EmailService, JwtStrategy, { provide: APP_GUARD, useClass: RolesGuard }],
  exports: [AuthService, EmailService],
})
export class AuthModule { }
