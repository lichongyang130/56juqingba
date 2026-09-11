// #473 — refresh dates.
//
// The rule this file implements, and the only one it is allowed to imply:
//
//   * "Added" is a fact — it is the published field on the record.
//   * "Review due" is a schedule, computed from the added date, not a claim
//     that anybody has reviewed anything. The wording says "due" for that
//     reason.
//   * An essay's "Updated" stamp is a fact: it comes from the article's own
//     updated field, which is also what the structured data declares.
//
// Keeping the distinction in one module means a page cannot accidentally print
// "reviewed" over a date nobody touched.

export const REVIEW_CYCLE_DAYS = 90;

const DAY_MS = 24 * 60 * 60 * 1000;

const parse = (iso: string) => new Date(`${iso}T00:00:00Z`).getTime();
const iso = (ms: number) => new Date(ms).toISOString().slice(0, 10);

/** The first scheduled review that has not yet passed, from the added date. */
export function reviewDue(published: string, from = today()): string {
  const start = parse(published);
  const now = parse(from);
  if (!Number.isFinite(start) || now <= start) return iso(start + REVIEW_CYCLE_DAYS * DAY_MS);
  const cycles = Math.floor((now - start) / (REVIEW_CYCLE_DAYS * DAY_MS)) + 1;
  return iso(start + cycles * REVIEW_CYCLE_DAYS * DAY_MS);
}

/** How many review cycles have passed, i.e. how many were due before today. */
export function cyclesDue(published: string, from = today()): number {
  const start = parse(published);
  const now = parse(from);
  if (!Number.isFinite(start) || now <= start) return 0;
  return Math.floor((now - start) / (REVIEW_CYCLE_DAYS * DAY_MS));
}

export function daysUntil(isoDay: string, from = today()): number {
  return Math.round((parse(isoDay) - parse(from)) / DAY_MS);
}

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function ageInDays(published: string, from = today()): number {
  return Math.round((parse(from) - parse(published)) / DAY_MS);
}
