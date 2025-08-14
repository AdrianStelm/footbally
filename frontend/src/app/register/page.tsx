"use client";

import { FieldConfig } from "../../../types/formTypes";
import Form from "../../../components/Form";
import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/navigation";

const registerFields: FieldConfig[] = [
    { name: "username", label: "Write your username", type: "text", required: true },
    { name: "email", label: "Write your email", type: "email", placeholder: "test@example.com", required: true },
    { name: "password", label: "Write your password", type: "password", required: true }
];

const REGISTER_USER = gql`
  mutation RegisterUser($data: CreateUser!) {
    createUser(data: $data) {
      email
      username
    }
  }
`;

export default function Page() {
    const [registerUser, { loading, error, data }] = useMutation(REGISTER_USER);
    const router = useRouter()

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
            console.log("User registered:", result.data.createUser);
            router.replace('/login')
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
