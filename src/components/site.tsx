import { Link } from "@tanstack/react-router";
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
    <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-3">
        <Link to="/" className="font-display text-2xl tracking-wide text-chrome">SBR</Link>
        <nav className="flex flex-1 gap-4 overflow-x-auto text-sm font-semibold uppercase tracking-wider">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="whitespace-nowrap text-muted-foreground transition hover:text-foreground"
              activeProps={{ className: "text-primary" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <a href={DISCORD_URL} target="_blank" rel="noreferrer"
          className="hidden rounded-sm bg-discord px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-discord-foreground sm:block">
          Discord
        </a>
      </div>
    </header>
  );
}

export function PageHeader({ title, subtitle, children }: { title: string; subtitle?: string; children?: ReactNode }) {
  return (
    <div className="border-b bg-card/40">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="racing-stripe mb-4 h-1.5 w-16" />
        <h1 className="font-display text-5xl tracking-wide text-chrome md:text-6xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl text-muted-foreground">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}

export function Page({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-6xl px-6 py-10">{children}</div>;
}

export function Flag({ code }: { code: string }) {
  if (!code || code.length !== 2) return null;
  const flag = code.toUpperCase().replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
  return <span title={code.toUpperCase()} className="mr-2">{flag}</span>;
}

export function Badge({ children, tone = "muted" }: { children: ReactNode; tone?: "muted" | "primary" }) {
  return (
    <span className={`rounded-sm px-2 py-0.5 text-xs font-semibold uppercase tracking-wider ${tone === "primary" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
      {children}
    </span>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="rounded-sm border border-dashed p-10 text-center text-muted-foreground">{children}</div>;
}

export function DataNote() {
  return (
    <p className="mt-12 text-xs text-muted-foreground">
      Data updates automatically from{" "}
      <a href={JUSTRACE_URL} target="_blank" rel="noreferrer" className="underline hover:text-foreground">JustRace</a>.
    </p>
  );
}

export const th = "px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground";
export const td = "px-3 py-2";
