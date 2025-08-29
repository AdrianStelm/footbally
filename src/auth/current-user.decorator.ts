// current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtPayload } from './jwt.guard';

export const CurrentUser = createParamDecorator(
    (data: keyof JwtPayload | undefined, context: ExecutionContext) => {
        const ctx = GqlExecutionContext.create(context).getContext() as { user?: JwtPayload };
        const user = ctx.user;

        if (!user) return null;

        if (data) {
            return user[data] ?? null; // повертаємо конкретне поле або null
        }

        return user; // весь payload
    },
);
