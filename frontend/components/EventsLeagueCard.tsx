"use client"
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { getLeaguesEvents } from "../api/getLeagues";

interface Props {
    idLeague: string;
}

type LeagueEventsApiResponse = {
    strLeague: string;
    strLeagueBadge: string;
    intRound: number;
    strHomeTeamBadge: string;
    strAwayTeamBadge: string;
    strHomeTeam: string;
    strAwayTeam: string;
    dateEvent: string;
    strTime: string
}

export default function EventsLeagueCard({ idLeague }: Props) {
    const { data, isLoading, error } = useQuery<LeagueEventsApiResponse[]>({
        queryKey: ["schedule", idLeague],
        queryFn: () => getLeaguesEvents(idLeague),
    });

    if (isLoading) return <p>Loading...</p>;
    if (error || !data) return <p>Error loading events</p>;

    return (
        <section className="mt-10">
            <h2 className="text-4xl text-center mb-5">{data[0].strLeague} | Round {data[0].intRound}</h2>
            <Image className="m-auto" src={data[0].strLeagueBadge} width={200} height={200} alt="League`s Logo"></Image>
            {data.map((event, index) => (
                <article className="flex justify-between items-center rounded-3xl p-5 mt-5 md:justify-around" key={index}>
                    <div className="flex flex-col items-center">
                        <Image loading="lazy" src={event.strHomeTeamBadge} alt="Home Team" width={100} height={100}></Image>
                        <p className="text-bold mt-5">{event.strHomeTeam}</p>
                    </div>
                    <time className="text-[12px] break-words md:text-xl">{event.dateEvent} | {event.strTime}</time>
                    <div className="flex flex-col items-center">
                        <Image loading="lazy" src={event.strAwayTeamBadge} alt="Away Team" width={100} height={100}></Image>
                        <p className="text-bold mt-5">{event.strAwayTeam}</p>
                    </div>
                </article>
            ))}
        </section>
    )
}