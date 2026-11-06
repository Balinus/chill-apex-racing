import { describe, expect, it } from "vitest";
import { entryPoints, parseStandings } from "./parse";

const d = (o: Record<string, unknown>) => ({
  ServerScheduleId: 1, SessionInfoId: 9, Position: 1, QualifyPosition: 1, FinishStatus: "Finished",
  DriverLaps: 20, Points: 25, BonusForFastestLap: 0, BonusForPolePosition: 1, PointsAdjustment: 0,
  HasSessionRun: true, IsVoided: false, ...o,
});

describe("championship points", () => {
  it("adds pole, fastest lap and adjustments to race points", () => {
    expect(entryPoints(d({ BonusForFastestLap: 1, PointsAdjustment: -2 }))).toBe(25);
  });
  it("gives zero points for a voided race", () => {
    expect(entryPoints(d({ IsVoided: true }))).toBe(0);
  });
  it("ignores races not yet run and sorts drivers by total", () => {
    const rows = parseStandings([
      { SteamId: "a", Fullname: "A", "x|1|r|9": JSON.stringify({ Data: [d({ Points: 10, BonusForPolePosition: 0 })] }) },
      { SteamId: "b", Fullname: "B", "x|1|r|9": { Data: [d({})] }, "y|2|r|0": { Data: [d({ HasSessionRun: false })] } },
    ]);
    expect(rows.map((r) => [r.driverId, r.total, r.races.length])).toEqual([["b", 26, 1], ["a", 10, 1]]);
  });
  it("excludes JustRace computer drivers without affecting human positions", () => {
    const rows = parseStandings([
      { SteamId: "2", Fullname: "Computer Racer (AI)", "x|1|r|9": { Data: [d({ Points: 100 })] } },
      { SteamId: "human", Fullname: "Human Racer", "x|1|r|9": { Data: [d({ Points: 10, BonusForPolePosition: 0 })] } },
    ]);

    expect(rows.map((r) => [r.driverId, r.name, r.total])).toEqual([["human", "Human Racer", 10]]);
  });
});
