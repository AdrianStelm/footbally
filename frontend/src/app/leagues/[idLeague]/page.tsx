import FootballTable from "../../../../components/Table";

export default async function LeaguePage({ params }: { params: Promise<{ idLeague: string }> }) {
    const { idLeague } = await params;
    const season = "2025-2026";

    return (
        <div className="p-4">
            <h2 className="text-4xl font-bold mb-4">League Table</h2>
            <FootballTable
                idLeague={idLeague}
                season={season}
                columns={[
                    "intRank",
                    "strBadge",
                    "strTeam",
                    "intPlayed",
                    "intWin",
                    "intDraw",
                    "intLoss",
                    "intGoalsFor",
                    "intGoalsAgainst",
                    "intGoalDifference",
                    "intPoints",
                ]}
            />

        </div>
    );
}
