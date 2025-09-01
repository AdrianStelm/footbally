"use client";
import { useQuery } from "@tanstack/react-query";
import { getLeagueTable } from "../api/getLeagues";
import Image from "next/image";
import { TeamType } from "../types/footballApiType";

interface Props {
    idLeague: string;
    season: string;
    columns: (keyof TeamType)[];
}

export default function FootballTable({ idLeague, season, columns }: Props) {
    const { data, isLoading, error } = useQuery({
        queryKey: ["table", idLeague, season],
        queryFn: () => getLeagueTable(idLeague, season),
    });

    if (isLoading) return <p>Loading...</p>;
    if (error || !data) return <p>Error loading table</p>;

    return (
        <div className="overflow-x-auto flex justify-center">
            <table className=" text-center border border-green-800  shadow min-w-max">
                <thead className="bg-green-800">
                    <tr>
                        {columns.map((col) => (
                            <th key={col} className="px-1 py-2">
                                {col.toUpperCase()}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((team: TeamType) => (
                        <tr
                            key={team.idTeam}
                            className="hover:bg-green-700 hover:text-white"
                        >
                            {columns.map((col) => (
                                <td key={col} className="py-2">
                                    {col === "strBadge" ? (
                                        <Image
                                            height={30}
                                            width={30}
                                            src={team.strBadge.replace("/tiny", "")}
                                            alt="Team logo"
                                            className="mx-auto "
                                        />
                                    ) : (
                                        team[col]
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
