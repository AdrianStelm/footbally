"use client"

import { use } from 'react'
import { FieldConfig } from "../../../types/formTypes";
import Form from "../../../components/Form";
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';

const fields: FieldConfig[] = [
    {
        name: "password",
        label: "Write your new password",
        type: "password",
        required: true
    }
]

const NEW_PASSWORD = gql`
  mutation passwordReset($token: String!, $newPassword: String!) {
    passwordReset(token: $token, newPassword: $newPassword)
  }
`

export default function Page({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
    const params = use(searchParams);
    const token = params.token;

    const [setNewPassword, { loading, error, data }] = useMutation(NEW_PASSWORD);
    const router = useRouter()

    async function sendPassword(formData: { password: string }, token?: string) {
        if (!token) {
            console.error("No token found!");
            return;
        }

        try {
            await setNewPassword({
                variables: {
                    token,
                    newPassword: formData.password,
                },
            });
            alert("Password changed successfully!");
            router.replace('/')
        } catch (err) {
            console.error(err);
            alert("Failed to reset password");
        }
    }

    return (
        <Form
            fields={fields}
            onSubmit={(formData) => sendPassword(formData, token)}
            buttonText={loading ? "Changing..." : "Change password"}
        />
    );
}
