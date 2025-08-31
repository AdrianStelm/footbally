"use client";
import { useState, useEffect, ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SliderProps<T> {
    items: T[];
    renderItem: (item: T) => ReactNode;
    autoPlay?: boolean;
    interval?: number;
}

export default function Slider<T>({
    items,
    renderItem,
    autoPlay = true,
    interval = 5000,
}: SliderProps<T>) {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!autoPlay) return;
        const id = setInterval(() => {
            setCurrent((prev) => (prev + 1) % items.length);
        }, interval);
        return () => clearInterval(id);
    }, [items.length, autoPlay, interval]);

    return (
        <div className="relative w-full py-20 max-w-3xl mx-auto overflow-hidden rounded-2xl shadow-lg">
            <div
                className="flex transition-transform duration-700"
                style={{ transform: `translateX(-${current * 100}%)` }}
            >
                {items.map((item, i) => (
                    <div key={i} className="w-full px-15 flex-shrink-0">
                        {renderItem(item)}
                    </div>
                ))}
            </div>

            <button
                onClick={() =>
                    setCurrent((prev) => (prev - 1 + items.length) % items.length)
                }
                className="absolute  top-1/2 -translate-y-1/2 bg-black text-white p-2 rounded-full opacity-70 hover:opacity-100"
            >
                <ChevronLeft />
            </button>
            <button
                onClick={() => setCurrent((prev) => (prev + 1) % items.length)}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-black text-white p-2 rounded-full opacity-70 hover:opacity-100"
            >
                <ChevronRight />
            </button>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                {items.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`w-3 h-3 rounded-full ${i === current ? "bg-green-900" : "bg-gray-400"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
