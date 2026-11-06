import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { leagueQuery, fmtDate } from "@/lib/justrace.functions";
import { Badge, DataNote, Empty, Flag, Page, PageHeader, td, th } from "@/components/site";

export const Route = createFileRoute("/championships/$id")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(leagueQuery);
    const c = data.championships.find((x) => String(x.id) === params.id);
    if (!c) throw notFound();
    return { name: c.name };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — Silver Brothers Racing` },
          { name: "description", content: `Standings and calendar for the ${loaderData.name} championship.` },
          { property: "og:title", content: `${loaderData.name} — Silver Brothers Racing` },
          { property: "og:description", content: `Standings and calendar for ${loaderData.name}.` },
          { property: "og:type", content: "website" },
          { name: "twitter:card", content: "summary_large_image" },
        ]
      : [{ title: "Championship — Silver Brothers Racing" }, { name: "robots", content: "noindex" }],
  }),
  component: ChampionshipPage,
});

function ChampionshipPage() {
  const { id } = Route.useParams();
  const { data } = useSuspenseQuery(leagueQuery);
  const c = data.championships.find((x) => String(x.id) === id)!;
  return (
    <>
      <PageHeader title={c.name} subtitle={`${c.game} · ${fmtDate(c.start)} – ${fmtDate(c.end)}`}>
        <div className="mt-4"><Badge tone={c.active ? "primary" : "muted"}>{c.active ? "Active" : "Finished"}</Badge></div>
      </PageHeader>
      <Page>
        <h2 className="font-display text-3xl tracking-wide">Standings</h2>
        {c.standings.length === 0 ? <div className="mt-4"><Empty>No drivers registered yet.</Empty></div> : (
          <div className="mt-4 overflow-x-auto rounded-sm border">
            <table className="w-full text-sm">
              <thead className="bg-secondary">
                <tr>
                  <th className={th}>Pos</th><th className={th}>Driver</th>
                  {c.rounds.map((r) => <th key={r.id} className={`${th} text-center`} title={r.track}>R{r.round}</th>)}
                  <th className={`${th} text-right`}>Points</th>
                </tr>
              </thead>
              <tbody>
                {c.standings.map((s, i) => (
                  <tr key={s.driverId} className="border-t">
                    <td className={`${td} font-display text-xl ${i < 3 ? "text-primary" : ""}`}>{i + 1}</td>
                    <td className={td}>
                      <Link to="/drivers/$driverId" params={{ driverId: s.driverId }} className="font-semibold hover:text-primary">
                        <Flag code={s.country} />{s.name}
                      </Link>
                    </td>
                    {c.rounds.map((r) => {
                      const e = s.races.find((x) => x.scheduleId === r.id);
                      return <td key={r.id} className={`${td} text-center text-muted-foreground`}>{e ? (e.position > 0 ? `P${e.position}` : e.finishStatus || "—") : ""}</td>;
                    })}
                    <td className={`${td} text-right font-bold`}>{s.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <h2 className="mt-12 font-display text-3xl tracking-wide">Calendar</h2>
        <div className="mt-4 grid gap-3">
          {c.rounds.map((r) => (
            <Link key={r.id} to="/events/$id" params={{ id: String(r.id) }}
              className="flex items-center justify-between rounded-sm border bg-card p-4 transition hover:border-primary">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Round {r.round} · {fmtDate(r.start, true)}</div>
                <div className="font-display text-2xl tracking-wide">{r.track}</div>
              </div>
              <Badge tone={r.finished ? "muted" : "primary"}>{r.finished ? "Completed" : "Upcoming"}</Badge>
            </Link>
          ))}
        </div>
        {c.pointSystem.length > 0 && (
          <p className="mt-8 text-sm text-muted-foreground">Points: {c.pointSystem.join(" · ")}</p>
        )}
        <DataNote />
      </Page>
    </>
  );
}
