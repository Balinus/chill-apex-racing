import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { leagueQuery } from "@/lib/justrace.functions";
import { Badge, DataNote, Empty, Page, PageHeader } from "@/components/site";

export const Route = createFileRoute("/tracks")({
  head: () => ({
    meta: [
      { title: "Tracks — Chill Apex Racing" },
      { name: "description", content: "Every track raced in Chill Apex Racing championships." },
      { property: "og:title", content: "Tracks — Chill Apex Racing" },
      { property: "og:description", content: "Every track we've raced on." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(leagueQuery),
  component: Tracks,
});

function Tracks() {
  const { data } = useSuspenseQuery(leagueQuery);
  const rounds = data.championships.flatMap((c) => c.rounds);
  return (
    <>
      <PageHeader title="Tracks" subtitle="All the circuits on our calendars." />
      <Page>
        {data.tracks.length === 0 ? <Empty>No tracks yet.</Empty> : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.tracks.map((t) => {
              const img = rounds.find((r) => r.trackId === t.id)?.trackImage;
              return (
                <div key={t.id} className="overflow-hidden border bg-card shadow-panel">
                  {img && <img src={img} alt={t.name} loading="lazy" className="aspect-video w-full object-cover" />}
                  <div className="p-4">
                    <h2 className="font-display text-2xl tracking-wide">{t.name}</h2>
                    <p className="text-sm text-muted-foreground">{[t.city, t.country].filter(Boolean).join(", ")}</p>
                    <div className="mt-3 flex gap-2">
                      {t.length > 0 && <Badge>{(t.length / 1000).toFixed(2)} km</Badge>}
                      <Badge tone="primary">{t.rounds} {t.rounds === 1 ? "race" : "races"}</Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <DataNote />
      </Page>
    </>
  );
}
