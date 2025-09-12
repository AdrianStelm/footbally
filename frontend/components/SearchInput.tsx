"use client";

import { useState, useEffect } from "react";
import { useDebouncedValue } from "../hooks/useDebouncedQuery";
import { Search } from "lucide-react";

interface SearchInputProps<T> {
    placeholder?: string;
    fetchResults: (query: string) => Promise<T[]>;
    renderItem: (item: T) => React.ReactNode;
    delay?: number;
}

export function SearchInput<T>({
    placeholder = "Search...",
    fetchResults,
    renderItem,
    delay = 500,
}: SearchInputProps<T>) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);

    const debouncedQuery = useDebouncedValue(query, delay);

    useEffect(() => {
        const trimmed = debouncedQuery.trim();

        if (!trimmed) {
            setResults([]);
            return;
        }

        setLoading(true);

        fetchResults(trimmed)
            .then((res) => setResults(res))
            .finally(() => setLoading(false));
    }, [debouncedQuery, fetchResults]);

    return (
        <div className="relative w-full max-w-xs">
            <div className="relative">
                <input
                    type="search"
                    placeholder={placeholder}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="py-2 pr-12 pl-4 rounded-2xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-600 w-full"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-800 p-2 rounded-full flex items-center justify-center">
                    <Search className="w-4 h-4 text-white" />
                </div>
            </div>

            {query && (
                <div className="absolute top-full mt-2 left-0 w-full bg-neutral-900 text-white rounded-xl shadow-lg max-h-60 overflow-y-auto z-50">
                    {loading && (
                        <div className="p-3 text-gray-500 text-sm">Searching...</div>
                    )}
                    {!loading && results.length === 0 && (
                        <div className="p-3 text-gray-500 text-sm">No results</div>
                    )}
                    {results.map((item, index) => (
                        <div key={index}>{renderItem(item)}</div>
                    ))}
                </div>
            )}
        </div>
    );
}
