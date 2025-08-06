import { Injectable } from '@nestjs/common';
import { UserDto, UpdateUserDto } from './user.dto';
import {User} from '@prisma/client'
import { PrismaService } from '../prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async create(dto:UserDto):Promise<User>{
        return await this.prisma.user.create({
            data:dto
        })
    }

    async getOneById(id:string):Promise<User | null>{
        return await this.prisma.user.findFirst({
            where:{id}
        })
    }

    async getAll():Promise<User[] | null>{
        return await this.prisma.user.findMany()
    }

    async updateById(id:string, newData:UpdateUserDto):Promise<User>{
        return await this.prisma.user.update({where:{id}, data:newData})
    }

    async deleteById(id:string):Promise<void>{
        await this.prisma.user.delete({where: {id}})
    }


}
