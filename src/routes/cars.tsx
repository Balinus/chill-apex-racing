import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { leagueQuery } from "@/lib/justrace.functions";
import { Badge, DataNote, Empty, Page, PageHeader } from "@/components/site";

export const Route = createFileRoute("/cars")({
  head: () => ({
    meta: [
      { title: "Cars — Silver Brothers Racing" },
      { name: "description", content: "Car classes raced in Silver Brothers Racing championships." },
      { property: "og:title", content: "Cars — Silver Brothers Racing" },
      { property: "og:description", content: "The cars and classes we race with." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(leagueQuery),
  component: Cars,
});

function Cars() {
  const { data } = useSuspenseQuery(leagueQuery);
  return (
    <>
      <PageHeader title="Cars" subtitle="The car classes we've raced with." />
      <Page>
        {data.classes.length === 0 ? <Empty>No cars yet.</Empty> : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.classes.map((c) => (
              <div key={c.id} className="rounded-sm border bg-card p-5">
                <h2 className="font-display text-3xl tracking-wide">{c.name}</h2>
                {c.description && <p className="mt-2 text-sm text-muted-foreground">{c.description}</p>}
                <div className="mt-4"><Badge tone="primary">{c.rounds} {c.rounds === 1 ? "race" : "races"}</Badge></div>
              </div>
            ))}
          </div>
        )}
        <DataNote />
      </Page>
    </>
  );
}
