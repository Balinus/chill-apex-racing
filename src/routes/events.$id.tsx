import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { leagueQuery, fmtDate } from "@/lib/justrace.functions";
import { Badge, DataNote, Empty, Flag, JUSTRACE_URL, Page, PageHeader, td, th } from "@/components/site";

export const Route = createFileRoute("/events/$id")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(leagueQuery);
    const r = data.championships.flatMap((c) => c.rounds).find((x) => String(x.id) === params.id);
    if (!r) throw notFound();
    return { title: `${r.championship} R${r.round}: ${r.track}` };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — Silver Brothers Racing` },
          { name: "description", content: `Details and results for ${loaderData.title}.` },
          { property: "og:title", content: `${loaderData.title} — Silver Brothers Racing` },
          { property: "og:description", content: `Details and results for ${loaderData.title}.` },
        ]
      : [{ title: "Event — Silver Brothers Racing" }, { name: "robots", content: "noindex" }],
  }),
  component: EventPage,
});

function EventPage() {
  const { id } = Route.useParams();
  const { data } = useSuspenseQuery(leagueQuery);
  const c = data.championships.find((x) => x.rounds.some((r) => String(r.id) === id))!;
  const r = c.rounds.find((x) => String(x.id) === id)!;
  const results = c.standings
    .map((s) => ({ s, e: s.races.find((x) => x.scheduleId === r.id) }))
    .filter((x) => x.e)
    .sort((a, b) => (a.e!.position || 999) - (b.e!.position || 999));
  return (
    <>
      <PageHeader title={r.track} subtitle={`${c.name} · Round ${r.round} of ${r.totalRounds} · ${fmtDate(r.start, true)}`}>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge tone={r.finished ? "muted" : "primary"}>{r.finished ? "Completed" : "Upcoming"}</Badge>
          <Badge>{r.carClass}</Badge><Badge>Qualifying {r.qualifyMins} min</Badge><Badge>Race {r.raceMins} min</Badge>
        </div>
      </PageHeader>
      <Page>
        {(r.image || r.trackImage) && <img src={r.image ?? r.trackImage!} alt={r.track} className="mb-10 max-h-96 w-full rounded-sm object-cover" />}
        <h2 className="font-display text-3xl tracking-wide">Results</h2>
        {results.length === 0 ? (
          <div className="mt-4"><Empty>
            {r.finished ? "No results recorded." : <>Not raced yet — {r.registered} registered. <a className="text-primary underline" href={`${JUSTRACE_URL}/en/events`} target="_blank" rel="noreferrer">Register on JustRace</a></>}
          </Empty></div>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-sm border">
            <table className="w-full text-sm">
              <thead className="bg-secondary"><tr>
                <th className={th}>Pos</th><th className={th}>Driver</th><th className={th}>Quali</th><th className={th}>Laps</th><th className={th}>Status</th><th className={`${th} text-right`}>Points</th>
              </tr></thead>
              <tbody>
                {results.map(({ s, e }) => (
                  <tr key={s.driverId} className="border-t">
                    <td className={`${td} font-display text-xl`}>{e!.position || "—"}</td>
                    <td className={td}><Link to="/drivers/$driverId" params={{ driverId: s.driverId }} className="font-semibold hover:text-primary"><Flag code={s.country} />{s.name}</Link></td>
                    <td className={td}>{e!.qualifyPosition ? `P${e!.qualifyPosition}` : "—"}</td>
                    <td className={td}>{e!.laps}</td>
                    <td className={`${td} text-muted-foreground`}>{e!.finishStatus}</td>
                    <td className={`${td} text-right font-bold`}>{e!.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-6"><Link to="/championships/$id" params={{ id: String(c.id) }} className="text-sm text-primary hover:underline">← {c.name} standings</Link></p>
        <DataNote />
      </Page>
    </>
  );
}
