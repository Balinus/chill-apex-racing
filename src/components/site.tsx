import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Menu } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

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
    <header className="sticky top-0 z-30 overflow-hidden border-b-4 border-b-teal bg-foreground text-background">
      <div aria-hidden className="sunset-bands absolute left-0 top-0 hidden h-full w-20 -skew-x-[30deg] -translate-x-6 opacity-90 lg:block" />
      <div className="mx-auto flex max-w-7xl items-center gap-5 px-5 py-3 md:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-3" aria-label="Chill Apex Racing home">
          <span className="flex flex-col leading-none lg:pl-10">
            <span className="font-script text-2xl text-background md:text-3xl">Chill Apex</span>
            <span className="mt-1 font-display text-sm font-bold uppercase italic tracking-[0.3em] text-primary">Racing</span>
          </span>
        </Link>
        <nav className="hidden flex-1 gap-4 px-1 font-mono text-[13px] font-semibold uppercase md:flex lg:gap-5" aria-label="Main navigation">
          {nav.map((n) => (
            <Link key={n.to} to={n.to}
              className="whitespace-nowrap border-b-2 border-transparent py-2 text-background/80 transition-colors hover:border-primary hover:text-background"
              activeProps={{ className: "border-primary text-background" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex shrink-0 items-center gap-3">
          <Button asChild className="h-11 rounded-none px-4 font-mono text-[13px] font-semibold uppercase shadow-none">
            <a href={DISCORD_URL} target="_blank" rel="noreferrer">Discord <ArrowUpRight /></a>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-11 w-11 rounded-none border-background/40 bg-transparent text-background md:hidden" aria-label="Open navigation" title="Open navigation"><Menu /></Button>
            </SheetTrigger>
            <SheetContent aria-describedby={undefined}>
              <SheetTitle className="mt-6 text-left font-display text-3xl uppercase">Chill Apex Racing</SheetTitle>
              <nav className="mt-8 flex flex-col" aria-label="Mobile navigation">
                {nav.map((n) => (
                  <SheetClose asChild key={n.to}>
                    <Link to={n.to} className="border-b py-4 font-mono text-[13px] font-semibold uppercase text-reading" activeProps={{ className: "text-foreground" }}>{n.label}</Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t-4 border-t-teal bg-foreground text-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <div className="font-script text-4xl">Chill Apex <span className="font-display font-bold uppercase italic text-primary">Racing</span></div>
          <p className="mt-2 font-mono text-xs text-background/75">© {new Date().getFullYear()} Chill Apex Racing</p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs uppercase">
          <a href={DISCORD_URL} target="_blank" rel="noreferrer" className="hover:text-primary">Discord ↗</a>
          <a href={JUSTRACE_URL} target="_blank" rel="noreferrer" className="hover:text-primary">JustRace ↗</a>
        </div>
      </div>
    </footer>
  );
}

export function PageHeader({ title, subtitle, children }: { title: string; subtitle?: string | undefined; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b bg-secondary/50">
      <div className="relative mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
        <h1 className="max-w-5xl font-display text-6xl font-bold uppercase italic leading-[0.9] tracking-tight md:text-8xl">{title}</h1>
        <div aria-hidden className="teal-lines mt-5 h-2 w-40" />
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
