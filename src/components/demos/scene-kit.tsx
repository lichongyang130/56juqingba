"use client";

// Shared by every scene set: the props type, and the handful of values more
// than one scene needs. Split out of Demo.tsx when the scenes moved to their own
// modules (batch 85) — a helper used by two sets lives here rather than being
// duplicated into both.

export type DemoProps = Record<string, number | string | boolean>;

/** #511 — "verified" means the same thing here as on the front page: a prompt
 *  whose status passed its recorded runs. Demo copy that mentions the catalog
 *  reads these constants instead of its own numbers. */
