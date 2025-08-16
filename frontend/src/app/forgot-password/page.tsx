"use client"
import { FieldConfig } from "../../../types/formTypes";
import Form from "../../../components/Form";
import { gql, useMutation } from "@apollo/client";
import { useState } from "react";

const resetField: FieldConfig[] = [
    { name: "email", label: 'Write your email', type: 'email', placeholder: 'test@example.com', required: true },
]

const RESET_PASSWORD = gql`
  mutation requestPasswordReset($email:String!){
    requestPasswordReset(email:$email)
  }
`

export default function Page() {
    const [resetPassword] = useMutation(RESET_PASSWORD)
    const [message, setMessage] = useState<string | null>(null)

    async function handleSubmit(values: { email: string }) {
        try {
            const res = await resetPassword({ variables: { email: values.email } })
            console.log("✅ success", res)
            setMessage("Letter for resetting password was sent to email.")
        } catch (err) {
            console.error("❌ error", err)
            setMessage("Error")
        }
    }

    return (
        <div>
            <Form fields={resetField} onSubmit={handleSubmit} buttonText="Reset password" />
            {message && (
                <p className="mt-2 text-sm text-green-600">{message}</p>
            )}
        </div>
    )
}
