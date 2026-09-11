// #488 — the mascot: one of the logo's dots, escaped from the frame.
//
// Original geometry, drawn in the same 6-unit language as the mark: a rounded
// body, two eyes and a nub that lifts when it is happy. Three poses only —
// lost, found, idle — because a character with forty poses is a project, and
// this one exists to make a 404 page feel authored.

export type MascotPose = "lost" | "found" | "idle";

export function Mascot({
  pose = "idle",
  size = 96,
  className,
  id = "mascot",
}: {
  pose?: MascotPose;
  size?: number;
  className?: string;
  /** #507 — the body gradient's id. The mascot page draws three poses; two of
   *  them sharing an id is a duplicate in the document. */
  id?: string;
}) {
  const tilt = pose === "lost" ? -8 : pose === "found" ? 4 : 0;
  const eyeShift = pose === "lost" ? -1.6 : 0;
  const nub = pose === "found" ? 5 : pose === "lost" ? -3 : 0;

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="64" y2="64">
          <stop stopColor="#8b5cf6" />
          <stop offset="0.55" stopColor="#6366f1" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <g transform={`rotate(${tilt} 32 40)`}>
        {/* the nub — the character's only expressive part */}
        <path
          d={`M32 ${10 - nub} q3 -6 6 -2`}
          stroke={`url(#${id})`}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <rect x="10" y="14" width="44" height="44" rx="15" fill={`url(#${id})`} />
        <g fill="#08090f">
          {pose === "idle" ? (
            <>
              <rect x={22 + eyeShift} y="32" width="6" height="2.6" rx="1.3" />
              <rect x={36 - eyeShift} y="32" width="6" height="2.6" rx="1.3" />
            </>
          ) : (
            <>
              <circle cx={25 + eyeShift} cy="33" r="3" />
              <circle cx={39 + eyeShift} cy="33" r="3" />
            </>
          )}
        </g>
        {/* mouth: a flat line when idle, a small curve otherwise */}
        <path
          d={pose === "lost" ? "M28 43 q4 -3 8 0" : pose === "found" ? "M27 42 q5 4 10 0" : "M28 43 h8"}
          stroke="#08090f"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />
      </g>
      {/* an item the character has dropped or found */}
      {pose === "lost" && <circle cx="52" cy="54" r="3" fill="#22d3ee" opacity="0.55" />}
      {pose === "found" && <circle cx="52" cy="52" r="3" fill="#22d3ee" />}
    </svg>
  );
}
