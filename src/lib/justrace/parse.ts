// Pure helpers that turn raw JustRace API payloads into league data.
// No network here so it can be unit-tested.

export const JR_ASSET_BASE = "https://www.justrace.net/apiv3";
export const assetUrl = (p?: string | null) => (p ? `${JR_ASSET_BASE}${p}` : null);

export type RaceEntry = {
  scheduleId: number;
  sessionId: number;
  position: number;
  qualifyPosition: number;
  finishStatus: string;
  laps: number;
  points: number; // race points + bonuses + adjustments
  hasRun: boolean;
  voided: boolean;
};

export type StandingRow = {
  driverId: string;
  name: string;
  realName: string;
  country: string;
  total: number;
  races: RaceEntry[];
};

type RawData = {
  ServerScheduleId: number;
  SessionInfoId: number;
  Position: number;
  QualifyPosition: number;
  FinishStatus: string;
  DriverLaps: number;
  Points: number;
  BonusForFastestLap: number;
  BonusForPolePosition: number;
  PointsAdjustment: number;
  HasSessionRun: boolean;
  IsVoided: boolean;
};

export function entryPoints(d: Pick<RawData, "Points" | "BonusForFastestLap" | "BonusForPolePosition" | "PointsAdjustment" | "IsVoided">) {
  if (d.IsVoided) return 0;
  return (d.Points || 0) + (d.BonusForFastestLap || 0) + (d.BonusForPolePosition || 0) + (d.PointsAdjustment || 0);
}

/** Standings rows contain dynamic keys "track|schedule|...|session" whose value is JSON (string or object). */
export function parseStandings(raw: Record<string, unknown>[]): StandingRow[] {
  const rows = raw.map((r) => {
    const races: RaceEntry[] = [];
    for (const [k, v] of Object.entries(r)) {
      if (!k.includes("|")) continue;
      let val: unknown = v;
      if (typeof val === "string") {
        try { val = JSON.parse(val); } catch { continue; }
      }
      const data = (val as { Data?: RawData[] })?.Data ?? [];
      for (const d of data) {
        if (!d.HasSessionRun) continue;
        races.push({
          scheduleId: d.ServerScheduleId,
          sessionId: d.SessionInfoId,
          position: d.Position,
          qualifyPosition: d.QualifyPosition,
          finishStatus: d.FinishStatus,
          laps: d.DriverLaps,
          points: entryPoints(d),
          hasRun: d.HasSessionRun,
          voided: d.IsVoided,
        });
      }
    }
    const first = String(r.FirstName ?? "").trim();
    const last = String(r.LastName ?? "").trim();
    return {
      driverId: String(r.SteamId ?? r.Fullname),
      name: String(r.Fullname ?? `${first} ${last}`),
      realName: `${first} ${last}`.trim(),
      country: String(r.CountryCode ?? ""),
      total: races.reduce((s, x) => s + x.points, 0),
      races,
    };
  });
  return rows.sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));
}
