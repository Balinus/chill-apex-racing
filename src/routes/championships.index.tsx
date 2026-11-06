import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { leagueQuery, fmtDate } from "@/lib/justrace.functions";
import { Badge, DataNote, Empty, Page, PageHeader } from "@/components/site";

export const Route = createFileRoute("/championships/")({
  head: () => ({
    meta: [
      { title: "Championships — Silver Brothers Racing" },
      { name: "description", content: "Current and past Silver Brothers Racing championships with full standings." },
      { property: "og:title", content: "Championships — Silver Brothers Racing" },
      { property: "og:description", content: "Current and past championships with full standings." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(leagueQuery),
  component: Championships,
});

function Championships() {
  const { data } = useSuspenseQuery(leagueQuery);
  const list = data.championships;
  return (
    <>
      <PageHeader title="Championships" subtitle="Active and past championships, with the full history of every season." />
      <Page>
        {list.length === 0 ? <Empty>No championships yet.</Empty> : (
          <div className="grid gap-6 md:grid-cols-2">
            {list.map((c) => {
              const leader = c.standings[0];
              const done = c.rounds.filter((r) => r.finished).length;
              return (
                <Link key={c.id} to="/championships/$id" params={{ id: String(c.id) }}
                  className="group overflow-hidden border bg-card shadow-panel transition-colors hover:border-primary">
                  {c.poster && <img src={c.poster} alt={c.name} loading="lazy" className="aspect-[16/7] w-full object-cover" />}
                  <div className="p-5">
                    <div className="flex items-center gap-2">
                      <Badge tone={c.active ? "primary" : "muted"}>{c.active ? "Active" : "Finished"}</Badge>
                      <span className="text-xs text-muted-foreground">{c.game}</span>
                    </div>
                    <h2 className="mt-2 font-display text-3xl tracking-wide">{c.name}</h2>
                    <p className="text-sm text-muted-foreground">{fmtDate(c.start)} – {fmtDate(c.end)}</p>
                    <div className="mt-4 flex justify-between text-sm">
                      <span>Round {done} / {c.rounds.length}</span>
                      {leader && leader.total > 0 && <span className="text-silver">Leader: <b>{leader.name}</b> ({leader.total} pts)</span>}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
        <DataNote />
      </Page>
    </>
  );
}
