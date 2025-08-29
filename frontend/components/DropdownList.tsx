'use client';
import { useQuery } from '@tanstack/react-query';
import { getLeagues } from '../api/getLeagues';
import Link from "next/link";
import { useState } from 'react';

interface Props {
    dropdownCaption: string
}

export default function DropdownList({ dropdownCaption }: Props) {
    const [open, setOpen] = useState(false)
    const { data, isLoading, error } = useQuery({
        queryKey: ['leagues'],
        queryFn: getLeagues,
    });

    if (isLoading) return <div>Завантаження...</div>;
    if (error) return <div>Помилка!</div>;

    return (
        <div className='relative'>
            <p onClick={() => setOpen(!open)}>{dropdownCaption}</p>
            <div className={` ${open ? "absolute gap-0.5 right-5 grid grid-cols-1 rounded-2xl bg-white/20 p-2 backdrop-blur-md w-max lg:grid-cols-3 lg:gap-2  z-999 " : 'hidden'}`}>

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
    )
}
