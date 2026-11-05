import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero-racing.jpg";

const DISCORD = "https://www.discord.gg/YVWCtyACXj";
const JR = "https://silverbrothers.justrace.net";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Silver Brothers Racing — Sim-Racing League" },
      { name: "description", content: "Join Silver Brothers Racing: championships, race events, standings and a friendly sim-racing community." },
      { property: "og:title", content: "Silver Brothers Racing — Sim-Racing League" },
      { property: "og:description", content: "Championships, race events, standings and a friendly sim-racing community." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const sections = [
  { title: "Drivers", desc: "View driver profiles, ratings, and performance history", path: "/drivers" },
  { title: "Championships", desc: "Current and past championships — full history and final standings", path: "/championships" },
  { title: "Race Events", desc: "Browse upcoming and completed race events and results", path: "/events" },
  { title: "Teams", desc: "Explore team rosters and championship entries", path: "/teams" },
  { title: "Cars", desc: "Browse the cars we race with", path: "/cars" },
  { title: "Tracks", desc: "All the tracks we've raced on", path: "/tracks" },
] as const;

function Index() {
  return (
    <main className="min-h-screen">
      <section className="relative overflow-hidden">
        <img src={hero} alt="Silver race cars battling at night" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-hero-fade" />
        <div className="relative mx-auto max-w-6xl px-6 py-28 md:py-40">
          <div className="racing-stripe mb-6 h-2 w-24" />
          <h1 className="font-display text-6xl leading-none tracking-wide text-chrome md:text-8xl">
            Silver Brothers<br />Racing
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            A sim-racing league for drivers of all skill levels. Clean racing, close battles and a
            community that's always happy to help you get faster.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href={DISCORD} target="_blank" rel="noreferrer"
              className="rounded-sm bg-discord px-6 py-3 font-semibold uppercase tracking-wider text-discord-foreground transition hover:opacity-90">
              Join our Discord
            </a>
            <a href={JR} target="_blank" rel="noreferrer"
              className="rounded-sm bg-primary px-6 py-3 font-semibold uppercase tracking-wider text-primary-foreground shadow-glow transition hover:opacity-90">
              View Race Events
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-4xl tracking-wide text-silver">Explore the League</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((s) => (
            <Link key={s.title} to={s.path}
              className="group relative overflow-hidden rounded-sm border bg-card p-6 transition hover:-translate-y-1 hover:border-primary">
              <div className="absolute left-0 top-0 h-full w-1 bg-primary opacity-0 transition group-hover:opacity-100" />
              <h3 className="font-display text-3xl tracking-wide">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              <span className="mt-4 inline-block text-sm font-semibold uppercase tracking-wider text-primary">Open →</span>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Silver Brothers Racing ·{" "}
        <a href={DISCORD} target="_blank" rel="noreferrer" className="hover:text-foreground">Discord</a> ·{" "}
        <a href={JR} target="_blank" rel="noreferrer" className="hover:text-foreground">Race Events</a>
      </footer>
    </main>
  );
}
