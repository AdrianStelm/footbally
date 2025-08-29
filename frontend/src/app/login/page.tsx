"use client"

import { FieldConfig } from "../../../types/formTypes"
import Form from "../../../components/Form"
import { gql, useMutation } from "@apollo/client"
import { useRouter } from "next/navigation"
import { useAuthStore } from "../../../store/authStore"
import Link from "next/link"
import { UserType } from "../../../types/userType"

const loginFields: FieldConfig[] = [
    { name: "email", label: 'Write your email', type: 'email', placeholder: 'test@example.com', required: true },
    { name: "password", label: 'Write your password', type: 'password', required: true }
]

const LOGIN_USER = gql`
mutation LoginUser($email: String!, $password: String!) {
  login(email: $email, password: $password){
  access_token
  userId
  }
}
`
type LoginUserType = Omit<UserType, 'username'>

export default function Page() {

    const [loginUser, { error }] = useMutation(LOGIN_USER);
    const router = useRouter()
    const setAuth = useAuthStore((state) => state.setAuth);


    const handleLogin = async (formData: LoginUserType) => {
        try {
            const result = await loginUser({
                variables: {
                    email: formData.email,
                    password: formData.password
                }
            });
            const { access_token, userId } = result.data.login;
            setAuth(access_token, userId);
            router.replace('/')
        } catch (err) {
            console.error("Login error:", err);
        }
    };

    return (
        <div className="flex h-screen flex-col items-center justify-center">
            <h2 className="text-5xl">Sign in</h2>
            <Form fields={loginFields} onSubmit={handleLogin} buttonText="Sign in"></Form>
            {error && <p className="text-red-500 mt-2">Error: {error.message}</p>}
            <Link href='/forgot-password' className=" hover:underline">Forgot password?</Link>
        </div>
    )
}