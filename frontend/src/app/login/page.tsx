"use client"

import { FieldConfig } from "../../../types/formTypes"
import Form from "../../../components/Form"
import { gql, useMutation } from "@apollo/client"
import { useRouter } from "next/navigation"

const loginFields: FieldConfig[] = [
    { name: "email", label: 'Write your email', type: 'email', placeholder: 'test@example.com', required: true },
    { name: "password", label: 'Write your password', type: 'password', required: true }
]

const LOGIN_USER = gql`
mutation LoginUser($email: String!, $password: String!) {
  login(email: $email, password: $password) 
}
`

export default function Page() {

    const [loginUser, { loading, error, data }] = useMutation(LOGIN_USER);
    const router = useRouter()

    const handleLogin = async (formData: any) => {
        try {
            const result = await loginUser({
                variables: {
                    email: formData.email,
                    password: formData.password
                }
            });
            console.log("User loginned:", result.data.createUser);
            router.replace('/')
        } catch (err) {
            console.error("Login error:", err);
        }
    };

    return (
        <div>
            <Form fields={loginFields} onSubmit={handleLogin} buttonText="Login"></Form>
            {error && <p className="text-red-500 mt-2">Error: {error.message}</p>}
        </div>
    )
}