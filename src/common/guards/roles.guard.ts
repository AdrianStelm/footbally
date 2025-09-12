import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as jwt from 'jsonwebtoken';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from 'src/user/role.enum';
import { JwtPayload } from './jwt.guard';

interface GqlContext {
  req: {
    headers: {
      authorization?: string;
    };
  };
  user?: JwtPayload;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<Role[]>(ROLES_KEY, context.getHandler());
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const ctx = GqlExecutionContext.create(context).getContext<GqlContext>();
    const authHeader = ctx.req.headers.authorization;
    if (!authHeader) throw new ForbiddenException('No token provided');

    const token = authHeader.split(' ')[1];
    if (!token) throw new ForbiddenException('Invalid token');

    let payload: JwtPayload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET || 'secret') as JwtPayload;
    } catch {
      throw new ForbiddenException('Token expired or invalid');
    }

    ctx.user = payload;

    if (!requiredRoles.includes(payload.role! as Role)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
