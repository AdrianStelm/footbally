"use client";
import { useQuery } from "@tanstack/react-query";
import { getLeagueTable } from "../api/getLeagues";
import Image from "next/image";
import { TeamType } from "../types/footballApiType";

interface Props {
    idLeague: string;
    season: string;
}

export default function FootballTable({ idLeague, season }: Props) {
    const { data, isLoading, error } = useQuery({
        queryKey: ["table", idLeague, season],
        queryFn: () => getLeagueTable(idLeague, season),
    });

    if (isLoading) return <p>Loading...</p>;
    if (error || !data) return <p>Error loading table</p>;
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border border-gray-300 rounded-lg shadow">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="px-4 py-2">#</th>
                        <th className="px-4 py-2">Team</th>
                        <th className="px-4 py-2">P</th>
                        <th className="px-4 py-2">W</th>
                        <th className="px-4 py-2">D</th>
                        <th className="px-4 py-2">L</th>
                        <th className="px-4 py-2">GF</th>
                        <th className="px-4 py-2">GA</th>
                        <th className="px-4 py-2 font-bold">Pts</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((team: TeamType) => (
                        <tr key={team.idTeam} className="hover: bg-green-700">
                            <td className="px-4 py-2">{team.intRank}</td>
                            <td className="px-4 py-2"><Image height={50} width={50} src={team.strBadge} alt="Team logo"></Image></td>
                            <td className="px-4 py-2">{team.strTeam}</td>
                            <td className="px-4 py-2">{team.intPlayed}</td>
                            <td className="px-4 py-2">{team.intWin}</td>
                            <td className="px-4 py-2">{team.intDraw}</td>
                            <td className="px-4 py-2">{team.intLoss}</td>
                            <td className="px-4 py-2">{team.intGoalsFor}</td>
                            <td className="px-4 py-2">{team.intGoalsAgainst}</td>
                            <td className="px-4 py-2">{team.intGoalDifference}</td>
                            <td className="px-4 py-2 font-bold">{team.intPoints}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
