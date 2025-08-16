"use client";

import { FieldConfig } from "../../../types/formTypes";
import Form from "../../../components/Form";
import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../store/authStore";

const registerFields: FieldConfig[] = [
    { name: "username", label: "Write your username", type: "text", required: true },
    { name: "email", label: "Write your email", type: "email", placeholder: "test@example.com", required: true },
    { name: "password", label: "Write your password", type: "password", required: true }
];

const REGISTER_USER = gql`
mutation RegisterUser($data: CreateUser!) {
  createUser(data: $data) {
    userId
    access_token
  }
}
`;

export default function Page() {
    const [registerUser, { loading, error, data }] = useMutation(REGISTER_USER);
    const router = useRouter()
    const setAuth = useAuthStore((state) => state.setAuth);



    const handleRegister = async (formData: any) => {
        try {
            const result = await registerUser({
                variables: {
                    data: {
                        email: formData.email,
                        username: formData.username,
                        password: formData.password
                    }
                }
            });
            const { access_token, userId } = result.data.createUser;
            setAuth(access_token, userId);
            router.replace('/')
        } catch (err) {
            console.error("Registration error:", err);
        }
    };

    return (
        <div className="p-4">
            <Form fields={registerFields} onSubmit={handleRegister} buttonText={loading ? "Loading..." : "Register"} />
            {error && <p className="text-red-500 mt-2">Error: {error.message}</p>}
            {data && <p className="text-green-500 mt-2">User created: {data.createUser.username}</p>}
        </div>
    );
}
