"use client";

import { FieldConfig } from "../../../types/formTypes";
import Form from "../../../components/Form";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../store/authStore";
import Link from "next/link";
import { UserType } from "../../../types/userType";
import { GoogleLogin } from "@react-oauth/google";
import { useApolloClient } from "@apollo/client";
import { LOGIN_USER, GOOGLE_LOGIN } from "../../../graphql/mutations/auth/authMutations";

const loginFields: FieldConfig[] = [
    { name: "email", label: "Write your email", type: "email", placeholder: "test@example.com", required: true },
    { name: "password", label: "Write your password", type: "password", required: true }
];



type LoginUserType = Omit<UserType, "username">;

export default function Page() {
    const [loginUser, { error }] = useMutation(LOGIN_USER);
    const [googleLogin] = useMutation(GOOGLE_LOGIN);
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);
    const client = useApolloClient();


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
            await client.resetStore()
            router.replace("/");
        } catch (err) {
            console.error("Login error:", err);
        }
    };


    return (
        <div className="flex h-screen flex-col items-center justify-center gap-4">
            <h2 className="text-5xl">Sign in</h2>
            <Form fields={loginFields} onSubmit={handleLogin} buttonText="Sign in" />
            {error && <p className="text-red-500 mt-2">Error: {error.message}</p>}
            <Link href="/forgot-password" className="hover:underline">
                Forgot password?
            </Link>
            <GoogleLogin
                theme="filled_blue"
                onSuccess={async (credentialResponse) => {
                    try {
                        const idToken = credentialResponse.credential;
                        if (!idToken) return;

                        const { data } = await googleLogin({ variables: { idToken } });

                        if (data?.googleLogin?.access_token && data?.googleLogin?.userId) {
                            setAuth(data.googleLogin.access_token, data.googleLogin.userId);
                            await client.resetStore()
                            router.replace("/");
                        }
                    } catch (err) {
                        console.error("Google login error:", err);
                    }
                }}
                onError={() => console.log("Google login failed")}
            />
        </div>
    );
}
