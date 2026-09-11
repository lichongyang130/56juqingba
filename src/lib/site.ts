// Central brand config — change these values to rebrand the whole site.
export const SITE = {
  name: "Motif UI",
  domain: "motifui.dev", // placeholder — verify availability before launch
  // The public repository. Real today (it is this site's origin), unlike the
  // domain above; pages that link "open an issue" or to a source file derive
  // their URL from here instead of typing it a second time.
  repo: "https://github.com/lichongyang130/56juqingba",
  tagline: "Copy less. Ship more.",
  description:
    "The open web-craft platform: original animated components, AI website prompts with real-world test scores, backgrounds, and interactive lab tools.",
  twitter: "@motifui",
  // CTA copy shown across the site
  ctas: {
    primary: "Browse the library",
    secondary: "Try the Lab",
  },
};

export const NAV = [
  { href: "/components", label: "Components" },
  { href: "/prompts", label: "AI Prompts" },
  { href: "/backgrounds", label: "Backgrounds" },
  { href: "/lab", label: "Lab" },
  { href: "/learn", label: "Learn" },
  { href: "/pricing", label: "Pricing" },
];
