export type FieldConfig = {
    name: string;
    label?: string;
    type: "text" | "email" | "password";
    placeholder?: string;
    required?: boolean;
};
