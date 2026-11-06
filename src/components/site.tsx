import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

export const DISCORD_URL = "https://www.discord.gg/YVWCtyACXj";
export const JUSTRACE_URL = "https://silverbrothers.justrace.net";

const nav = [
  { to: "/drivers", label: "Drivers" },
  { to: "/championships", label: "Championships" },
  { to: "/events", label: "Events" },
  { to: "/teams", label: "Teams" },
  { to: "/cars", label: "Cars" },
  { to: "/tracks", label: "Tracks" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-t-4 border-t-primary bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-5 px-5 py-3 md:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-3" aria-label="Silver Brothers Racing home">
          <span className="clip-panel flex h-11 w-11 items-center justify-center bg-foreground font-display text-2xl font-bold italic text-background">SB</span>
          <span className="hidden font-mono text-[10px] font-semibold uppercase leading-4 tracking-[0.18em] text-muted-foreground sm:block">
            Silver Brothers<br /><span className="text-foreground">Racing League</span>
          </span>
        </Link>
        <nav className="flex flex-1 gap-5 overflow-x-auto px-1 font-mono text-[11px] font-semibold uppercase tracking-wider" aria-label="Main navigation">
          {nav.map((n) => (
            <Link key={n.to} to={n.to}
              className="whitespace-nowrap border-b-2 border-transparent py-2 text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
              activeProps={{ className: "border-primary text-foreground" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <a href={DISCORD_URL} target="_blank" rel="noreferrer"
          className="hidden shrink-0 items-center gap-2 border border-foreground px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-wider transition-colors hover:bg-foreground hover:text-background md:flex">
          Discord <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <div className="font-display text-3xl font-bold uppercase italic">Silver Brothers Racing</div>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-background/60">Clean racing. Close battles. One community.</p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-wider">
          <a href={DISCORD_URL} target="_blank" rel="noreferrer" className="hover:text-primary">Discord ↗</a>
          <a href={JUSTRACE_URL} target="_blank" rel="noreferrer" className="hover:text-primary">JustRace ↗</a>
          <span className="text-background/50">© {new Date().getFullYear()} SBR</span>
        </div>
      </div>
    </footer>
  );
}

export function PageHeader({ title, subtitle, children }: { title: string; subtitle?: string | undefined; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b bg-secondary/50">
      <div className="relative mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
        <h1 className="max-w-5xl font-display text-6xl font-bold uppercase leading-[0.9] tracking-tight md:text-8xl">{title}</h1>
        {subtitle && <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}

export function Page({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">{children}</div>;
}

export function Flag({ code }: { code: string }) {
  if (!code || code.length !== 2) return null;
  const flag = code.toUpperCase().replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
  return <span title={code.toUpperCase()} className="mr-2">{flag}</span>;
}

export function Badge({ children, tone = "muted" }: { children: ReactNode; tone?: "muted" | "primary" }) {
  return (
    <span className={`border px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider ${tone === "primary" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground"}`}>
      {children}
    </span>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="border border-dashed bg-card p-10 text-center text-muted-foreground">{children}</div>;
}

export function DataNote() {
  return (
    <p className="mt-12 border-t pt-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
      Live data / updated automatically from{" "}
      <a href={JUSTRACE_URL} target="_blank" rel="noreferrer" className="underline hover:text-foreground">JustRace</a>.
    </p>
  );
}

export const th = "px-3 py-3 text-left font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground";
export const td = "px-3 py-3";
