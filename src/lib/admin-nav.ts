/* ---------------------------------------------------------------------
   One list of admin sections, shared by the sidebar, the phone nav and the
   mobile index page. Keeping it here rather than in the client component
   stops the three from drifting apart.
   --------------------------------------------------------------------- */

export interface AdminNavItem {
  href: string;
  label: string;
  icon: string;
  /** the dashboard needs an exact match, or every child route lights it up */
  exact?: boolean;
}

export const ADMIN_NAV: AdminNavItem[] = [
  { href: "/admin", label: "Dashboard", icon: "▤", exact: true },
  { href: "/admin/assets", label: "Assets", icon: "▦" },
  { href: "/admin/prompts", label: "AI Prompts", icon: "◎" },
  { href: "/admin/moderation", label: "Moderation", icon: "✓" },
  { href: "/admin/pipeline", label: "Pipeline", icon: "≡" },
  { href: "/admin/health", label: "Health", icon: "◈" },
  { href: "/admin/stats", label: "Quick stats", icon: "▨" },
  { href: "/admin/content", label: "Content", icon: "✎" },
  { href: "/admin/inspector", label: "Inspector", icon: "▣" },
  { href: "/admin/changelog", label: "Changelog", icon: "✧" },
  { href: "/admin/rerun", label: "Prompt re-run", icon: "↻" },
  { href: "/admin/escalation", label: "Escalation", icon: "◭" },
  { href: "/admin/notifications", label: "Notifications", icon: "◔" },
  { href: "/admin/duplicates", label: "Duplicates", icon: "⧉" },
  { href: "/admin/exports", label: "Exports", icon: "⤓" },
  { href: "/admin/theme", label: "Theme room", icon: "◐" },
  { href: "/admin/mobile", label: "Mobile pass", icon: "▭" },
  { href: "/admin/schedule", label: "Scheduling", icon: "◷" },
  { href: "/admin/search", label: "Search", icon: "⌕" },
  { href: "/admin/audit", label: "Audit trail", icon: "☰" },
  { href: "/admin/settings", label: "Settings", icon: "⚙" },
];
