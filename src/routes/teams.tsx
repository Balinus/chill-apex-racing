import { createFileRoute } from "@tanstack/react-router";
import { DISCORD_URL, Empty, Page, PageHeader } from "@/components/site";

export const Route = createFileRoute("/teams")({
  head: () => ({
    meta: [
      { title: "Teams — Silver Brothers Racing" },
      { name: "description", content: "Team rosters and team championship entries in Silver Brothers Racing." },
      { property: "og:title", content: "Teams — Silver Brothers Racing" },
      { property: "og:description", content: "Team rosters and championship entries." },
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
