"use client";

import { FieldConfig } from "../../../types/formTypes";
import Form from "../../../components/Form";
import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../store/authStore";
import Link from "next/link";
import { UserType } from "../../../types/userType";

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



    const handleRegister = async (formData: UserType) => {
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
        <main className="grid flex-1 grid-cols-1 gap-10 md:grid-cols-2 ">
            <div className="bg-[url('/img/bg.jpg')] bg-cover bg-center py-10 flex gap-30 justify-center flex-col items-center  rounded-2xl">
                <h2 className="text-5xl md:text-7xl text-white ">Welcome back!</h2>
                <Link className="px-30 py-4 text-white   bg-black rounded-2xl hover:bg-green-700" href='/login'>Sign in</Link>
            </div>
            <div className="p-4 rounded-2xl flex justify-center flex-col">
                <h2 className="text-5xl  text-center">Create account</h2>
                <Form fields={registerFields} onSubmit={handleRegister} buttonText={loading ? "Loading..." : "Sign up"} />
                {error && <p className="text-red-500 mt-2">Error: {error.message}</p>}
                {data && <p className="text-green-500 mt-2">User created: {data.createUser.username}</p>}
            </div>
        </main>
    );
}
