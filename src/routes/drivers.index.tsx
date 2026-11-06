import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { buildDrivers, leagueQuery } from "@/lib/justrace.functions";
import { DataNote, Empty, Flag, Page, PageHeader, td, th } from "@/components/site";

export const Route = createFileRoute("/drivers/")({
  head: () => ({
    meta: [
      { title: "Drivers — Silver Brothers Racing" },
      { name: "description", content: "Silver Brothers Racing driver profiles, wins, podiums and championship history." },
      { property: "og:title", content: "Drivers — Silver Brothers Racing" },
      { property: "og:description", content: "Driver profiles, wins, podiums and championship history." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(leagueQuery),
  component: Drivers,
});

function Drivers() {
  const { data } = useSuspenseQuery(leagueQuery);
  const drivers = buildDrivers(data);
  return (
    <>
      <PageHeader title="Drivers" subtitle="Everyone who has raced with us, ranked by career points." />
      <Page>
        {drivers.length === 0 ? <Empty>No drivers yet.</Empty> : (
          <div className="overflow-x-auto rounded-sm border">
            <table className="w-full text-sm">
              <thead className="bg-secondary"><tr>
                <th className={th}>#</th><th className={th}>Driver</th><th className={th}>Starts</th><th className={th}>Wins</th><th className={th}>Podiums</th><th className={th}>Titles</th><th className={`${th} text-right`}>Points</th>
              </tr></thead>
              <tbody>
                {drivers.map((d, i) => (
                  <tr key={d.id} className="border-t">
                    <td className={`${td} font-display text-xl`}>{i + 1}</td>
                    <td className={td}>
                      <Link to="/drivers/$driverId" params={{ driverId: d.id }} className="font-semibold hover:text-primary"><Flag code={d.country} />{d.name}</Link>
                      {d.realName && <div className="text-xs text-muted-foreground">{d.realName}</div>}
                    </td>
                    <td className={td}>{d.starts}</td><td className={td}>{d.wins}</td><td className={td}>{d.podiums}</td><td className={td}>{d.titles}</td>
                    <td className={`${td} text-right font-bold`}>{d.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <DataNote />
      </Page>
    </>
  );
}
