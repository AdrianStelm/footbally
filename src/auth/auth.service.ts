import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) { }

    async validateUser(email: string, password: string) {
        const user = await this.userService.findByEmail(email);
        if (!user) return null;

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return null;

        const { password: _, ...result } = user;
        return result;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id, role: user.role };

        const access_token = this.jwtService.sign(payload, {
            expiresIn: '15m',
            secret: process.env.JWT_SECRET_ACCESS_TOKEN,
        });

        const refresh_token = this.jwtService.sign(payload, {
            expiresIn: '7d',
            secret: process.env.JWT_SECRET_REFRESH_TOKEN,
        });

        await this.userService.updateRefreshToken(user.id, refresh_token);

        return {
            access_token,
            refresh_token,
            userId: user.id,
        };
    }

    async refreshTokens(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: process.env.JWT_SECRET_REFRESH_TOKEN,
            });

            const user = await this.userService.getById(payload.sub);
            if (!user) throw new Error('User not found');

            if (!user.refreshToken) throw new Error('No refresh token stored');

            if (refreshToken !== user.refreshToken)
                throw new Error('Invalid refresh token');

            return this.login(user);
        } catch {
            throw new Error('Refresh token expired or invalid');
        }
    }



}
