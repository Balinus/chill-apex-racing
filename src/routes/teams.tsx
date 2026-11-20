import { createFileRoute } from "@tanstack/react-router";
import { DISCORD_URL, Empty, Page, PageHeader } from "@/components/site";

export const Route = createFileRoute("/teams")({
  head: () => ({
    meta: [
      { title: "Teams — Chill Apex Racing" },
      { name: "description", content: "Team rosters and team championship entries in Chill Apex Racing." },
      { property: "og:title", content: "Teams — Chill Apex Racing" },
      { property: "og:description", content: "Team rosters and championship entries." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Teams,
});

function Teams() {
  return (
    <>
      <PageHeader title="Teams" subtitle="Team rosters and team championship entries." />
      <Page>
        <Empty>
          Our current championships are individual — no teams yet.{" "}
          <a href={DISCORD_URL} target="_blank" rel="noreferrer" className="text-primary underline">Chat with us on Discord</a> to start one.
        </Empty>
      </Page>
    </>
  );
}
