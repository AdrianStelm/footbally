"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { toast } from "sonner";

type BlockType = "text" | "image" | "video";

export interface Block {
    id: string;
    type: BlockType;
    content?: string;
    file?: File | string;
}

interface ArticleFormProps {
    initialTitle?: string;
    initialBlocks?: Block[];
    onSubmit: (data: { title: string; blocks: Block[] }) => Promise<void>;
    loading?: boolean;
}

export default function ArticleForm({
    initialTitle = "",
    initialBlocks = [],
    onSubmit,
    loading: externalLoading = false,
}: ArticleFormProps) {
    const [title, setTitle] = useState(initialTitle);
    const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setTitle(initialTitle);
    }, [initialTitle]);

    useEffect(() => {
        if (initialBlocks.length > 0) {
            setBlocks(initialBlocks);
        }
    }, [initialBlocks]);

    const addBlock = (type: BlockType) => {
        setBlocks(prev => [
            ...prev,
            { id: crypto.randomUUID(), type, content: "", file: undefined },
        ]);
    };

    const updateBlock = (id: string, updates: Partial<Block>) => {
        setBlocks(prev =>
            prev.map(block => (block.id === id ? { ...block, ...updates } : block))
        );
    };

    const removeBlock = (id: string) => {
        setBlocks(prev => prev.filter(block => block.id !== id));
    };

    const moveBlock = (id: string, direction: "up" | "down") => {
        setBlocks(prev => {
            const index = prev.findIndex(b => b.id === id);
            if (index === -1) return prev;
            const newBlocks = [...prev];
            const targetIndex = direction === "up" ? index - 1 : index + 1;
            if (targetIndex < 0 || targetIndex >= prev.length) return prev;
            [newBlocks[index], newBlocks[targetIndex]] = [
                newBlocks[targetIndex],
                newBlocks[index],
            ];
            return newBlocks;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit({ title, blocks });
        } catch (err) {
            const error = err as Error;
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 p-5 w-full rounded-2xl"
        >
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="p-3 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-600 w-full"
                required
            />

            {blocks.map((block) => (
                <div key={block.id} className="border border-gray-600 rounded-lg p-3 flex flex-col gap-2 relative">
                    {block.type === "text" && (
                        <textarea
                            placeholder="Text block"
                            value={block.content || ""}
                            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                            className="p-3 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-600 w-full h-32 resize-y"
                        />
                    )}

                    {block.type === "image" && (
                        <>
                            {typeof block.file === "string" && (
                                <Image src={block.file} alt='Existing' className="w-32 h-32 object-cover mb-2" />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    updateBlock(block.id, { file: e.target.files?.[0] })
                                }
                            />
                        </>
                    )}

                    {block.type === "video" && (
                        <>
                            {typeof block.file === "string" && (
                                <video src={block.file} controls className="w-64 h-36 mb-2" />
                            )}
                            <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    const maxSizeMB = 50;
                                    if (file.size / 1024 / 1024 > maxSizeMB) {
                                        toast.error(`Video size should not exceed ${maxSizeMB} MB`);
                                        return;
                                    }
                                    updateBlock(block.id, { file });
                                }}
                            />
                        </>
                    )}

                    <div className="flex gap-2">
                        <button type="button" className="px-2 py-1 text-sm bg-gray-800 rounded" onClick={() => moveBlock(block.id, "up")}>↑</button>
                        <button type="button" className="px-2 py-1 text-sm bg-gray-800 rounded" onClick={() => moveBlock(block.id, "down")}>↓</button>
                        <button type="button" className="px-2 py-1 text-sm bg-red-700 rounded" onClick={() => removeBlock(block.id)}>✕</button>
                    </div>
                </div>
            ))}

            <div className="flex gap-2">
                <button type="button" className="px-3 py-2 bg-blue-700 rounded" onClick={() => addBlock("text")}>+ Text</button>
                <button type="button" className="px-3 py-2 bg-green-700 rounded" onClick={() => addBlock("image")}>+ Image</button>
                <button type="button" className="px-3 py-2 bg-purple-700 rounded" onClick={() => addBlock("video")}>+ Video</button>
            </div>

            <button
                type="submit"
                disabled={loading || externalLoading}
                className={`px-4 py-2 rounded bg-green-900 hover:bg-green-700 transition ${loading || externalLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
                {loading || externalLoading ? "Saving..." : "Save Article"}
            </button>
        </form>
    );
}
