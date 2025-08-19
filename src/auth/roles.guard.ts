import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as jwt from 'jsonwebtoken';
import { ROLES_KEY } from './roles.decorator';
import { Role } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<Role[]>(ROLES_KEY, context.getHandler());
    if (!requiredRoles || requiredRoles.length === 0) return true; // без ролей доступ відкритий

    // Для GraphQL
    const ctx = GqlExecutionContext.create(context).getContext();
    const authHeader = ctx.req.headers['authorization'];
    if (!authHeader) throw new ForbiddenException('No token provided');

    const token = authHeader.split(' ')[1];
    if (!token) throw new ForbiddenException('Invalid token');

    let payload: any;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    } catch (err) {
      throw new ForbiddenException('Token expired or invalid');
    }

    ctx.user = payload; // додаємо юзера в контекст

    if (!requiredRoles.includes(payload.role)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
