import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { leagueQuery, fmtDate, type Round } from "@/lib/justrace.functions";
import { Badge, DataNote, Empty, JUSTRACE_URL, Page, PageHeader } from "@/components/site";

export const Route = createFileRoute("/events/")({
  head: () => ({
    meta: [
      { title: "Race Events — Chill Apex Racing" },
      { name: "description", content: "Upcoming and completed Chill Apex Racing events and results." },
      { property: "og:title", content: "Race Events — Chill Apex Racing" },
      { property: "og:description", content: "Upcoming and completed race events and results." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(leagueQuery),
  component: Events,
});

function EventCard({ r }: { r: Round }) {
  return (
    <Link to="/events/$id" params={{ id: String(r.id) }}
      className="group overflow-hidden border bg-card shadow-panel transition-colors hover:border-primary">
      {(r.image || r.trackImage) && <img src={r.image ?? r.trackImage!} alt={r.track} loading="lazy" className="aspect-video w-full object-cover" />}
      <div className="p-4">
        <div className="text-xs uppercase tracking-wider text-primary">{r.championship} · Round {r.round} of {r.totalRounds}</div>
        <h3 className="mt-1 font-display text-2xl tracking-wide">{r.track}</h3>
        <p className="text-sm text-muted-foreground">{fmtDate(r.start, true)}</p>
        <div className="mt-3 flex flex-wrap gap-2"><Badge>{r.carClass}</Badge><Badge>Q {r.qualifyMins}m · R {r.raceMins}m</Badge></div>
      </div>
    </Link>
  );
}

function Events() {
  const { data } = useSuspenseQuery(leagueQuery);
  const all = data.championships.flatMap((c) => c.rounds);
  const upcoming = all.filter((r) => !r.finished).sort((a, b) => a.start.localeCompare(b.start));
  const done = all.filter((r) => r.finished).sort((a, b) => b.start.localeCompare(a.start));
  return (
    <>
      <PageHeader title="Race Events" subtitle="Upcoming races and results from completed events.">
        <a href={`${JUSTRACE_URL}/en/events`} target="_blank" rel="noreferrer"
          className="mt-6 inline-block rounded-sm bg-primary px-5 py-2.5 text-sm font-semibold uppercase tracking-wider text-primary-foreground shadow-glow">
          Register on JustRace
        </a>
      </PageHeader>
      <Page>
        <h2 className="font-display text-3xl tracking-wide">Upcoming</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {upcoming.length ? upcoming.map((r) => <EventCard key={r.id} r={r} />) : <Empty>No upcoming events.</Empty>}
        </div>
        <h2 className="mt-12 font-display text-3xl tracking-wide">Completed</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {done.length ? done.map((r) => <EventCard key={r.id} r={r} />) : <Empty>No completed events yet.</Empty>}
        </div>
        <DataNote />
      </Page>
    </>
  );
}
