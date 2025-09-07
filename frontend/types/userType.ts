
export type UserType = {
    email: string,
    username: string,
    password: string
}

export type UpdateUserType = Partial<UserType> 