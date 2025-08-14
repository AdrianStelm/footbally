import { Injectable, BadRequestException } from '@nestjs/common';
import { UserDto, UpdateUserDto } from './user.dto';
import { User } from '@prisma/client'
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';


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


}
