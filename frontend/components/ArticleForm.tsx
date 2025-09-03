"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ArticleFormProps {
    initialTitle?: string;
    initialText?: string;
    onSubmit: (data: { title: string; text: string; file?: File }) => Promise<void>;
    loading?: boolean;
}

export default function ArticleForm({
    initialTitle = "",
    initialText = "",
    onSubmit,
    loading: externalLoading = false,
}: ArticleFormProps) {
    const [title, setTitle] = useState(initialTitle);
    const [text, setText] = useState(initialText);
    const [file, setFile] = useState<File | undefined>();
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const router = useRouter()

    useEffect(() => {
        setTitle(initialTitle);
    }, [initialTitle]);

    useEffect(() => {
        setText(initialText);
    }, [initialText]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg(null);

        try {
            await onSubmit({ title, text, file });
            toast.success("Article has created");
            router.replace('/articles')
        } catch (err) {
            const error = err as Error
            setErrorMsg(error?.message || "Error");
            toast.error("Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5 w-full rounded-2xl">
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="p-3 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-600 w-full"
                required
            />
            <textarea
                placeholder="Text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="p-3 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-600 w-full h-40 resize-y"
                required
            />
            <button
                type="submit"
                disabled={loading || externalLoading}
                className={`px-4 py-2 rounded bg-green-900 hover:bg-green-700 transition ${loading || externalLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
            >
                {loading || externalLoading ? "Saving..." : "Save Article"}
            </button>
            <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0])}
            />
            {errorMsg && <p className="text-red-500">{errorMsg}</p>}
        </form>
    );
}
