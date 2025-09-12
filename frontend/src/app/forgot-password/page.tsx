"use client";
import { FieldConfig } from "../../../types/formTypes";
import Form from "../../../components/Form";
import { useMutation } from "@apollo/client";
import { useState, useEffect } from "react";
import { RESET_PASSWORD } from "../../../graphql/mutations/auth/authMutations";

const resetField: FieldConfig[] = [
    {
        name: "email",
        label: "Write your email",
        type: "email",
        placeholder: "test@example.com",
        required: true,
    },
];



export default function Page() {
    const [resetPassword] = useMutation(RESET_PASSWORD);
    const [message, setMessage] = useState<string | null>(null);
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    async function handleSubmit(values: { email: string }) {
        if (cooldown > 0) return;
        try {
            await resetPassword({ variables: { email: values.email } });
            setMessage("Letter for resetting password was sent to your email.");
            setCooldown(60);
        } catch (err) {
            setMessage(`Error: ${err}`);
        }
    }

    return (
        <div className="flex h-screen flex-col items-center justify-center">
            <Form
                fields={resetField}
                onSubmit={handleSubmit}
                buttonText={cooldown > 0 ? `Send letter again in ${cooldown}s` : "Reset password"}
            />
            {message && (
                <p className="mt-2 text-sm text-green-600 text-center">{message}</p>
            )}
        </div>
    );
}
