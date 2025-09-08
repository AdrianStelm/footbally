import { Injectable, BadRequestException } from '@nestjs/common';
import { UserDto, UpdateUserDto } from './user.dto';
import { User } from '@prisma/client'
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';



@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async create(dto: UserDto): Promise<User> {
        const existingUser = await this.prisma.user.findFirst({ where: { email: dto.email } });
        if (existingUser) {
            throw new BadRequestException('This email is already registered');
        }

        const saltRounds = 10;
        const hash = await bcrypt.hash(dto.password, saltRounds);

        return await this.prisma.user.create({
            data: {
                ...dto,
                password: hash,
            },
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.prisma.user.findFirst({
            where: { email }
        })
    }

    async getAll(): Promise<User[] | null> {
        return await this.prisma.user.findMany()
    }

    async updateById(id: string, newData: UpdateUserDto): Promise<User> {
        return await this.prisma.user.update({ where: { id }, data: newData })
    }

    async getById(id: string): Promise<User | null> {
        return await this.prisma.user.findFirst({ where: { id } })
    }

    async deleteById(id: string): Promise<void> {
        await this.prisma.user.delete({ where: { id } })
    }

    async updatePassword(email: string, password: string): Promise<void> {
        await this.prisma.user.update({
            where: { email }, data: {
                password
            }
        })
    }

    async updateRefreshToken(userId: string, refreshToken: string) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken },
        });
    }

    async clearRefreshToken(userId: string): Promise<void> {
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null },
        });
    }

    async setResetToken(userId: string, resetToken: string, expireTime: Date) {
        await this.prisma.user.update({ where: { id: userId }, data: { resetPasswordToken: resetToken, resetPasswordExpires: expireTime } })
    }

    async findByValidResetToken(token: string) {
        const user = await this.prisma.user.findFirst({
            where: {
                resetPasswordToken: { not: null },
                resetPasswordExpires: { gt: new Date() },
            },
        });

        if (!user || !user.resetPasswordToken) return null;

        const isMatch = await bcrypt.compare(token, user.resetPasswordToken);
        if (!isMatch) return null;

        return user;
    }


    async resetPassword(userId: string, newPassword: string): Promise<boolean> {
        const hashed = await bcrypt.hash(newPassword, 10);

        await this.prisma.user.update({
            where: { id: userId },
            data: {
                password: hashed,
                resetPasswordToken: null,
                resetPasswordExpires: null,
            },
        });

        return true;
    }

    async changePassword(userId: string, inputedPassword: string, newPassword: string): Promise<boolean> {
        const user = await this.getById(userId);

        const isValid = await bcrypt.compare(inputedPassword, user!.password);
        if (!isValid) {
            throw new UnauthorizedException('Wrong current password');
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await this.updateById(userId, {
            password: hashedNewPassword,
        });

        return true;
    }

    async setEmailChangeToken(userId: string, newEmail: string, token: string, expireTime: Date) {
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                emailChangeToken: token,
                emailChangeExpires: expireTime,
                pendingEmail: newEmail,
            },
        });
    }

    async confirmEmailChange(token: string): Promise<boolean> {
        const user = await this.prisma.user.findFirst({
            where: {
                emailChangeToken: { not: null },
                emailChangeExpires: { gt: new Date() },
            },
        });

        if (!user || !user.emailChangeToken) return false;

        // порівнюємо токен з хешем у БД
        const isMatch = await bcrypt.compare(token, user.emailChangeToken);
        if (!isMatch) return false;

        if (!user.pendingEmail) {
            throw new Error('No pending email set');
        }

        // оновлюємо email і очищаємо токен
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                email: user.pendingEmail,
                pendingEmail: null,
                emailChangeToken: null,
                emailChangeExpires: null,
            },
        });

        return true;
    }





}
