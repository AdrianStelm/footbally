// current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtPayload } from './jwt.guard'; // тип з твого JwtGuard

export const CurrentUser = createParamDecorator(
    (data: keyof JwtPayload | undefined, context: ExecutionContext) => {
        const ctx = GqlExecutionContext.create(context).getContext();
        const user: JwtPayload = ctx.user;

        // Якщо передано ключ, повертаємо конкретне поле
        if (data) return user[data];
        return user; // інакше повертаємо весь payload
    },
);
