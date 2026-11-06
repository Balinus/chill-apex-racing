import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import hero from "@/assets/hero-racing.jpg";
import { DISCORD_URL, JUSTRACE_URL } from "@/components/site";

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
  { title: "Drivers", desc: "Career results, wins and championship history", path: "/drivers" },
  { title: "Championships", desc: "Every season, every round, every point", path: "/championships" },
  { title: "Race Events", desc: "Race weekends, entry details and results", path: "/events" },
  { title: "Teams", desc: "Team rosters and championship entries", path: "/teams" },
  { title: "Cars", desc: "The machinery in our virtual garage", path: "/cars" },
  { title: "Tracks", desc: "Circuits past, present and upcoming", path: "/tracks" },
] as const;

function Index() {
  return (
    <main>
      <section className="relative overflow-hidden border-b">
        <div className="technical-grid absolute inset-0 opacity-50" />
        <div className="relative mx-auto grid max-w-7xl lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col justify-center px-5 py-16 md:px-8 md:py-24 lg:pr-14">
            <div className="flex items-center gap-3 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              <span className="h-2 w-10 bg-primary" /> Silver Brothers / Racing League
            </div>
            <h1 className="mt-7 font-display text-7xl font-bold uppercase leading-[0.82] tracking-tight md:text-8xl xl:text-9xl">
              Racing is<br /><span className="text-primary">better</span><br />together.
            </h1>
            <p className="mt-8 max-w-lg text-lg leading-relaxed text-muted-foreground">
              A sim-racing league for drivers of all skill levels. Bring your race craft;
              we’ll bring close battles, clean driving and a community that helps you get faster.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <a href={JUSTRACE_URL} target="_blank" rel="noreferrer"
                className="clip-panel inline-flex items-center gap-3 bg-primary px-6 py-4 font-mono text-xs font-semibold uppercase tracking-wider text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5">
                Find your next race <ArrowUpRight className="h-4 w-4" />
              </a>
              <a href={DISCORD_URL} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-3 border border-foreground bg-background px-6 py-4 font-mono text-xs font-semibold uppercase tracking-wider transition-colors hover:bg-foreground hover:text-background">
                Join the Discord <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
            <div className="mt-12 flex flex-wrap gap-x-7 gap-y-3 border-t pt-5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              <span>01 / Clean racing</span><span>02 / Close battles</span><span>03 / All skill levels</span>
            </div>
          </div>

          <div className="relative min-h-[430px] bg-secondary p-5 md:p-8 lg:min-h-[690px]">
            <div className="absolute left-0 top-0 z-10 bg-primary px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-foreground">SBR / On track</div>
            <img src={hero} alt="Silver race cars battling at night" className="clip-panel h-full min-h-[390px] w-full object-cover contrast-110 saturate-75 lg:min-h-[625px]" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between bg-foreground p-5 text-background md:bottom-8 md:left-8 md:right-8">
              <div>
                <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-background/60">The next green flag</div>
                <div className="mt-1 font-display text-2xl font-semibold uppercase">Starts with you.</div>
              </div>
              <div className="racing-stripe h-9 w-16" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <div className="grid gap-6 md:grid-cols-[0.7fr_1.3fr] md:items-end">
          <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">/ Paddock directory</div>
          <h2 className="font-display text-5xl font-bold uppercase leading-none md:text-6xl">Your race weekend, covered.</h2>
        </div>
        <div className="mt-10 border-t">
          {sections.map((s, i) => (
            <Link key={s.title} to={s.path}
              className="group grid items-center gap-2 border-b py-6 transition-colors hover:bg-card md:grid-cols-[70px_0.8fr_1.2fr_50px] md:gap-5 md:px-3">
              <span className="font-mono text-xs text-muted-foreground">/{String(i + 1).padStart(2, "0")}</span>
              <h3 className="font-display text-4xl font-semibold uppercase leading-none transition-colors group-hover:text-primary">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
              <span className="hidden h-10 w-10 items-center justify-center border transition-colors group-hover:bg-foreground group-hover:text-background md:flex">
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:grid-cols-[1fr_auto] md:items-center md:px-8">
          <div>
            <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em]">/ The garage is open</div>
            <h2 className="mt-2 font-display text-5xl font-bold uppercase leading-none md:text-6xl">Come race with us.</h2>
          </div>
          <a href={DISCORD_URL} target="_blank" rel="noreferrer"
            className="inline-flex w-fit items-center gap-3 bg-foreground px-6 py-4 font-mono text-xs font-semibold uppercase tracking-wider text-background transition-transform hover:-translate-y-0.5">
            Say hello on Discord <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </main>
  );
}
