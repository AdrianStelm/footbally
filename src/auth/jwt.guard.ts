// jwt.guard.ts
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as jwt from 'jsonwebtoken';

export interface JwtPayload {
    sub: string;
    email?: string;
    username?: string;
    role?: string;
}

@Injectable()
export class JwtGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const ctx = GqlExecutionContext.create(context).getContext();
        const authHeader = ctx.req.headers['authorization'];
        if (!authHeader) throw new UnauthorizedException('No token');

        const token = authHeader.split(' ')[1];
        if (!token) throw new UnauthorizedException('Invalid token');

        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
            ctx.user = payload;
            return true;
        } catch {
            throw new UnauthorizedException('Token expired or invalid');
        }
    }
}
