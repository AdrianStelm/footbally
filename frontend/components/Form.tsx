"use client";
import { FieldConfig } from "../types/formTypes";
import { useForm, SubmitHandler, Path } from "react-hook-form";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface AuthFormProps<TFormValues extends Record<string, string>> {
    fields: FieldConfig[];
    onSubmit: SubmitHandler<TFormValues>;
    buttonText: string;
    disabled?: boolean
}

export default function Form<TFormValues extends Record<string, string>>({
    fields,
    onSubmit,
    buttonText,
    disabled,
}: AuthFormProps<TFormValues>) {
    const { register, handleSubmit, formState: { errors } } = useForm<TFormValues>();
    const [showPassword, setShowPassword] = useState(false);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-5 p-10 rounded-3xl flex-col items-center">
            {fields.map((field) => {
                const fieldName = field.name as Path<TFormValues>;
                return (
                    <div key={field.name} className="flex flex-col items-center relative">
                        <label className="font-medium">{field.label}</label>

                        <input
                            type={field.type === "password" && showPassword ? "text" : field.type}
                            placeholder={field.placeholder}
                            {...register(fieldName, {
                                required: field.required ? `${field.label} is required` : false,
                                pattern: field.type === "email"
                                    ? { value: /\S+@\S+\.\S+/, message: "Invalid email format" }
                                    : undefined
                            })}
                            className="border-2 border-green-800 focus:ring-2 focus:ring-green-600 rounded p-2 pr-10"
                        />

                        {field.type === "password" && (
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2 top-9"
                            >
                                {showPassword ? <EyeOff size={20} className="text-green-900" /> : <Eye size={20} className="text-green-900" />}
                            </button>
                        )}

                        {errors[fieldName] && (
                            <span className="text-red-500 text-sm">
                                {errors[fieldName]?.message as string}
                            </span>
                        )}
                    </div>
                );
            })}
            <button disabled={disabled} type="submit" className="mt-5 px-10 py-1 text-white bg-black rounded hover:bg-green-700">
                {buttonText}
            </button>
        </form>
    );
}
