import { Role } from "@prisma/client";

export interface IUser {
    id: string;
    email: string;
    username: string;
    password: string;
    role: Role;
    refreshToken?: string;
}