import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { buildDrivers, leagueQuery } from "@/lib/justrace.functions";
import { DataNote, Flag, Page, PageHeader, td, th } from "@/components/site";

export const Route = createFileRoute("/drivers/$driverId")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(leagueQuery);
    const d = buildDrivers(data).find((x) => x.id === params.driverId);
    if (!d) throw notFound();
    return { name: d.name };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — Silver Brothers Racing` },
          { name: "description", content: `${loaderData.name}'s results and championship history in Silver Brothers Racing.` },
          { property: "og:title", content: `${loaderData.name} — Silver Brothers Racing` },
          { property: "og:description", content: `${loaderData.name}'s results and championship history.` },
        ]
      : [{ title: "Driver — Silver Brothers Racing" }, { name: "robots", content: "noindex" }],
  }),
  component: DriverPage,
});

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-sm border bg-card p-4">
      <div className="font-display text-4xl text-chrome">{value}</div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

function DriverPage() {
  const { driverId } = Route.useParams();
  const { data } = useSuspenseQuery(leagueQuery);
  const d = buildDrivers(data).find((x) => x.id === driverId)!;
  return (
    <>
      <PageHeader title={d.name} subtitle={d.realName || undefined}>
        <div className="mt-2 text-lg"><Flag code={d.country} /></div>
      </PageHeader>
      <Page>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          <Stat label="Starts" value={d.starts} /><Stat label="Wins" value={d.wins} /><Stat label="Podiums" value={d.podiums} />
          <Stat label="Titles" value={d.titles} /><Stat label="Points" value={d.points} />
        </div>
        <h2 className="mt-12 font-display text-3xl tracking-wide">Championship history</h2>
        <div className="mt-4 overflow-x-auto rounded-sm border">
          <table className="w-full text-sm">
            <thead className="bg-secondary"><tr><th className={th}>Championship</th><th className={th}>Position</th><th className={th}>Starts</th><th className={`${th} text-right`}>Points</th></tr></thead>
            <tbody>
              {d.history.map((h) => (
                <tr key={h.championshipId} className="border-t">
                  <td className={td}><Link to="/championships/$id" params={{ id: String(h.championshipId) }} className="font-semibold hover:text-primary">{h.championship}</Link></td>
                  <td className={td}>P{h.position}</td><td className={td}>{h.starts}</td>
                  <td className={`${td} text-right font-bold`}>{h.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <DataNote />
      </Page>
    </>
  );
}
