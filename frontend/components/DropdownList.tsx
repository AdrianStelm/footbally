'use client';
import { useQuery } from '@tanstack/react-query';
import { getLeagues } from '../api/getLeagues';
import Link from "next/link";
import { useState, useRef, useEffect } from 'react';

interface Props {
    dropdownCaption: string;
}

export default function DropdownList({ dropdownCaption }: Props) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { data, isLoading, error } = useQuery({
        queryKey: ['leagues'],
        queryFn: getLeagues,
    });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (isLoading) return <div>Завантаження...</div>;
    if (error) return <div>Помилка!</div>;

    return (
        <div className='relative' ref={dropdownRef}>
            <p onClick={() => setOpen(!open)} className="cursor-pointer">{dropdownCaption}</p>
            <div className={`${open ? "absolute gap-0.5 grid grid-cols-1 bg-neutral-800 p-4 w-max lg:grid-cols-3 lg:gap-2 md:right-5 z-50" : 'hidden'}`}>
                {data
                    .filter(
                        (l) =>
                            l.strSport === "Soccer" &&
                            l.strLeague !== "_No League" &&
                            l.strLeague !== "Russian Football Premier League"
                    )
                    .map((l) => (
                        <Link
                            key={l.idLeague}
                            href={`/leagues/${l.idLeague}`}
                            className="hover:text-green-600 transition"
                        >
                            {l.strLeague}
                        </Link>
                    ))}
            </div>
        </div>
    );
}
