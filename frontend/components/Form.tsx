"use client";
import { FieldConfig } from "../types/formTypes";
import { useForm } from "react-hook-form";

interface AuthFormProps {
    fields: FieldConfig[];
    onSubmit: (data: any) => void;
    buttonText: string;
}

export default function Form({ fields, onSubmit, buttonText }: AuthFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm();

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="">
            {fields.map((field) => (
                <div key={field.name} className="flex flex-col">
                    <label className="font-medium">{field.label}</label>
                    <input
                        type={field.type}
                        placeholder={field.placeholder}
                        {...register(field.name, {
                            required: field.required ? `${field.label} is required` : false,
                            pattern: field.type === "email"
                                ? { value: /\S+@\S+\.\S+/, message: "Invalid email format" }
                                : undefined
                        })}
                        className="border rounded p-2"
                    />
                    {errors[field.name] && (
                        <span className="text-red-500 text-sm">
                            {errors[field.name]?.message as string}
                        </span>
                    )}
                </div>
            ))}
            <button
                type="submit"
                className="p-5"
            >
                {buttonText}
            </button>
        </form>
    );
}
