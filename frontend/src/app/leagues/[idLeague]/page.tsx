import FootballTable from "../../../../components/Table";

export default async function LeaguePage({ params }: { params: Promise<{ idLeague: string }> }) {
    const { idLeague } = await params;
    const season = "2025-2026";

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">League Table</h1>
            <FootballTable idLeague={idLeague} season={season} />
        </div>
    );
}
