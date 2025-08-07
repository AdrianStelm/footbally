import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(
        private userService:UserService,
        private jwtService:JwtService
    ){}

    async ValidateUser(email:string,plainPassword:string){
        const user = await this.userService.findByEmail(email);
        if (!user) return null
        const isPasswordMatches = await bcrypt.compare(plainPassword, user.password)
        if (!isPasswordMatches) return null

        const {password, ...result} = user;
        return result
    }

    async login(user:any){
        const payload = {email:user.email, sub: user.id}
        return{
            acces_token:this.jwtService.sign(payload)
        }
    }
}
