import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";
import { assetUrl, parseStandings, type StandingRow } from "./justrace/parse";

const API = "https://www.justrace.net/apiv3";
const SUBDOMAIN = "chillapexracing";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`JustRace ${path} failed [${res.status}]: ${await res.text()}`);
  return res.json() as Promise<T>;
}

export type Round = {
  id: number;
  championshipId: number;
  championship: string;
  round: number;
  totalRounds: number;
  start: string;
  trackId: string;
  track: string;
  carClass: string;
  qualifyMins: number;
  raceMins: number;
  registered: number;
  image: string | null;
  trackImage: string | null;
  finished: boolean;
};

export type Championship = {
  id: number;
  name: string;
  game: string;
  start: string;
  end: string;
  active: boolean;
  poster: string | null;
  pointSystem: number[];
  rounds: Round[];
  standings: StandingRow[];
};

export type Track = { id: string; name: string; city: string; country: string; length: number; rounds: number };
export type CarClass = { id: string; name: string; description: string; rounds: number };

export type LeagueData = {
  name: string;
  description: string;
  logo: string | null;
  discordUrl: string;
  championships: Championship[];
  tracks: Track[];
  classes: CarClass[];
  fetchedAt: string;
};

type RawSeason = {
  SeasonID: number; Name: string; GameId: number; Game: string; StartDate: string; EndDate: string;
  IsActive: boolean; PosterImage: string; SeasonConfiguration?: { PointSystems?: number[] };
};
type RawDetail = {
  ServerScheduleId: number; ScheduleStartTime: string; TotalRegistered: number; IsFinished: boolean;
  EventImage: string; TrackImage: string; SeasonSchedules: string;
  ServerSchedule: { TrackList: string; ClassList: string; QualifyDuration: number; RaceDuration: number };
};
type RawTrack = { id: number; name: string; extra_data?: { translated_name?: string; city?: string; country?: string; length?: number } };
type RawClass = { value: number; name: string; translated_name?: string; description?: string };

export const getLeagueData = createServerFn({ method: "GET" }).handler(async (): Promise<LeagueData> => {
  const community = await get<{
    CommunityId: number; Name: string; DescHtmlContent: string; DiscordUrl: string; PrimaryLogoUrl: string;
  }>(`/community/api/GetCommunityBySubdomain/${SUBDOMAIN}`);

  const [seasons, rawTracks, rawClasses] = await Promise.all([
    get<RawSeason[]>(`/season/api/GetCommunitySeasons/${community.CommunityId}`),
    get<RawTrack[]>(`/refdata/api/GetAms2Tracks`).catch(() => [] as RawTrack[]),
    get<RawClass[]>(`/refdata/api/GetAms2Classes`).catch(() => [] as RawClass[]),
  ]);

  const trackMap = new Map(rawTracks.map((t) => [String(t.id), t]));
  const classMap = new Map(rawClasses.map((c) => [String(c.value), c]));
  const trackName = (id: string) => trackMap.get(id)?.extra_data?.translated_name ?? trackMap.get(id)?.name ?? "Unknown track";
  const className = (ids: string) =>
    ids.split(/[,|]/).filter(Boolean).map((id) => classMap.get(id)?.translated_name ?? classMap.get(id)?.name ?? "Unknown").join(", ");

  const championships: Championship[] = await Promise.all(
    seasons.map(async (s) => {
      const [sched, standings] = await Promise.all([
        get<{ ServerScheduleDetails: RawDetail[] }>(`/season/api/GetSeasonSchedules/${s.SeasonID}/${s.GameId}/false/false`)
          .catch(() => ({ ServerScheduleDetails: [] as RawDetail[] })),
        get<Record<string, unknown>[]>(`/season/api/GetSeasonStandings/${s.SeasonID}/${s.GameId}/0`).catch(() => []),
      ]);
      const parsed = parseStandings(standings);
      const ran = new Set(parsed.flatMap((r) => r.races.map((x) => x.scheduleId)));
      const details = [...sched.ServerScheduleDetails].sort((a, b) => a.ScheduleStartTime.localeCompare(b.ScheduleStartTime));
      const rounds: Round[] = details.map((d, i) => ({
        id: d.ServerScheduleId,
        championshipId: s.SeasonID,
        championship: s.Name,
        round: i + 1,
        totalRounds: details.length,
        start: d.ScheduleStartTime,
        trackId: d.ServerSchedule.TrackList,
        track: trackName(d.ServerSchedule.TrackList),
        carClass: className(d.ServerSchedule.ClassList),
        qualifyMins: d.ServerSchedule.QualifyDuration,
        raceMins: d.ServerSchedule.RaceDuration,
        registered: d.TotalRegistered,
        image: assetUrl(d.EventImage),
        trackImage: assetUrl(d.TrackImage),
        finished: d.IsFinished || ran.has(d.ServerScheduleId),
      }));
      return {
        id: s.SeasonID, name: s.Name, game: s.Game, start: s.StartDate, end: s.EndDate,
        active: s.IsActive && new Date(s.EndDate).getTime() > Date.now() - 86400000,
        poster: assetUrl(s.PosterImage), pointSystem: s.SeasonConfiguration?.PointSystems ?? [],
        rounds, standings: parsed,
      };
    }),
  );
  championships.sort((a, b) => b.start.localeCompare(a.start));

  const allRounds = championships.flatMap((c) => c.rounds);
  const trackCount = new Map<string, number>();
  const classCount = new Map<string, number>();
  for (const r of allRounds) trackCount.set(r.trackId, (trackCount.get(r.trackId) ?? 0) + 1);
  for (const d of championships.flatMap((c) => c.rounds)) classCount.set(d.carClass, (classCount.get(d.carClass) ?? 0) + 1);

  const tracks: Track[] = [...trackCount].map(([id, n]) => {
    const t = trackMap.get(id);
    return { id, name: trackName(id), city: t?.extra_data?.city ?? "", country: t?.extra_data?.country ?? "", length: t?.extra_data?.length ?? 0, rounds: n };
  }).sort((a, b) => b.rounds - a.rounds || a.name.localeCompare(b.name));

  const classes: CarClass[] = [...classCount].map(([name, n]) => {
    const c = rawClasses.find((x) => (x.translated_name ?? x.name) === name);
    return { id: c ? String(c.value) : name, name, description: c?.description ?? "", rounds: n };
  }).sort((a, b) => b.rounds - a.rounds);

  return {
    name: community.Name,
    description: community.DescHtmlContent.replace(/<[^>]+>/g, "").trim(),
    logo: assetUrl(community.PrimaryLogoUrl),
    discordUrl: community.DiscordUrl,
    championships, tracks, classes,
    fetchedAt: new Date().toISOString(),
  };
});

export const leagueQuery = queryOptions({
  queryKey: ["league"],
  queryFn: () => getLeagueData(),
  staleTime: 5 * 60_000,
});

export type Driver = {
  id: string; name: string; realName: string; country: string;
  starts: number; wins: number; podiums: number; points: number; titles: number;
  history: { championshipId: number; championship: string; position: number; points: number; starts: number }[];
};

export function buildDrivers(data: LeagueData): Driver[] {
  const map = new Map<string, Driver>();
  for (const c of data.championships) {
    const done = c.rounds.length > 0 && c.rounds.every((r) => r.finished);
    c.standings.forEach((s, i) => {
      const d = map.get(s.driverId) ?? {
        id: s.driverId, name: s.name, realName: s.realName, country: s.country,
        starts: 0, wins: 0, podiums: 0, points: 0, titles: 0, history: [],
      };
      d.starts += s.races.length;
      d.wins += s.races.filter((r) => r.position === 1).length;
      d.podiums += s.races.filter((r) => r.position >= 1 && r.position <= 3).length;
      d.points += s.total;
      if (done && i === 0 && s.total > 0) d.titles += 1;
      d.history.push({ championshipId: c.id, championship: c.name, position: i + 1, points: s.total, starts: s.races.length });
      map.set(s.driverId, d);
    });
  }
  return [...map.values()].sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));
}

export const fmtDate = (iso: string, withTime = false) =>
  new Date(iso).toLocaleString("en-CA", {
    day: "2-digit", month: "short", year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit", timeZone: "America/Toronto", timeZoneName: "short" } : {}),
  });
