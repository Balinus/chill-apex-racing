import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import heroAsset from "@/assets/chill-apex-track-banner.png.asset.json";
import { DISCORD_URL, JUSTRACE_URL } from "@/components/site";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Chill Apex Racing — Sim-Racing League" },
      { name: "description", content: "Join Chill Apex Racing: championships, race events, standings and a friendly sim-racing community." },
      { property: "og:title", content: "Chill Apex Racing — Sim-Racing League" },
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
        <div className="relative mx-auto grid max-w-7xl lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col justify-center px-5 py-16 md:px-8 md:py-24 lg:pr-14">
            <h1 className="font-script text-[48px] leading-[1.05] sm:text-6xl md:text-7xl">
              The next <span className="text-sunset">green flag</span> starts with you.
            </h1>
            <div aria-hidden className="teal-lines mt-6 h-2 w-48" />
            <p className="mt-7 max-w-lg text-xl leading-relaxed text-reading">
              A sim-racing league for drivers of all skill levels. Bring your race craft;
              we’ll bring close battles, clean driving and a community that helps you get faster.
            </p>
            <div className="mt-8 flex w-full max-w-[320px] flex-col gap-3">
              <Button asChild className="clip-panel h-[54px] w-full rounded-none px-[26px] font-mono text-sm font-semibold uppercase shadow-none">
                <a href={JUSTRACE_URL} target="_blank" rel="noreferrer">Find your next race <ArrowUpRight /></a>
              </Button>
              <Button asChild variant="outline" className="clip-panel h-[54px] w-full rounded-none border-0 bg-foreground p-px shadow-none hover:bg-foreground">
                <a href={DISCORD_URL} target="_blank" rel="noreferrer">
                  <span className="clip-panel-inset flex h-full w-full items-center justify-center gap-2 bg-background px-[26px] font-mono text-sm font-semibold uppercase text-foreground">
                    Join us on Discord <ArrowUpRight />
                  </span>
                </a>
              </Button>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-7 bg-secondary p-5 md:p-8">
            <figure className="clip-panel w-full bg-foreground text-background">
              <img src={heroAsset.url} alt="Chill Apex Racing banner: a forested mountain circuit at sunset with a retro sliced sun and the words Sim Racing with Good Vibes" width={550} height={188} className="aspect-[550/188] w-full object-cover" />
              <figcaption className="p-5 md:p-6">
                <div className="font-mono text-lg font-bold uppercase text-background">Chill Apex on track</div>
              </figcaption>
            </figure>
            <ul className="grid gap-3 border-t pt-5 font-mono text-xs font-semibold uppercase text-reading">
              <li><b className="mr-2 text-teal">01</b>Clean racing</li>
              <li><b className="mr-2 text-teal">02</b>Close battles</li>
              <li><b className="mr-2 text-teal">03</b>All skill levels</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <h2 className="font-display text-5xl font-bold uppercase italic leading-none md:text-6xl">Paddock directory</h2>
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

      <section className="border-y-4 border-y-teal bg-sunset text-background">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:grid-cols-[1fr_auto] md:items-center md:px-8">
          <h2 className="font-script text-5xl leading-none md:text-6xl">Come race with us.</h2>
          <Button asChild className="clip-panel h-auto w-fit rounded-none bg-foreground px-[26px] py-[17px] font-mono text-sm font-semibold uppercase text-background shadow-none hover:bg-foreground/90">
            <a href={DISCORD_URL} target="_blank" rel="noreferrer">Say hello on Discord <ArrowUpRight /></a>
          </Button>
        </div>
      </section>
    </main>
  );
}
