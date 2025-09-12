"use client"

import { use } from 'react'
import { FieldConfig } from "../../../types/formTypes";
import Form from "../../../components/Form";
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { NEW_PASSWORD } from '../../../graphql/mutations/user/userMutations';

const fields: FieldConfig[] = [
    {
        name: "password",
        label: "Write your new password",
        type: "password",
        required: true
    }
]

export default function Page({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
    const params = use(searchParams);
    const token = params.token;

    const [setNewPassword, { loading }] = useMutation(NEW_PASSWORD);
    const router = useRouter()

    async function sendPassword(formData: { password: string }, token?: string) {
        if (!token) {
            return;
        }

        try {
            await setNewPassword({
                variables: {
                    token,
                    newPassword: formData.password,
                },
            });
            toast.success("Password changed successfully!");
            router.replace('/')
        } catch (err) {
            const error = err as Error
            toast.error(`Failed to reset password${error.message}`);
        }
    }

    return (
        <main className="flex h-screen flex-col items-center justify-center">
            <Form<{ password: string }>
                fields={fields}
                onSubmit={(formData) => sendPassword(formData, token)}
                buttonText={loading ? "Changing..." : "Change password"}
            />
        </main>
    );
}
