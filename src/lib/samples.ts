// Shared "Made with Motif" sample-build data used by the homepage
// and the /samples case-study pages. Original builds, original copy.

export interface SampleBuild {
  slug: string;
  title: string;
  by: string;
  used: string[]; // component slugs that make up the build
  kb: number; // approximate gzip page weight
  note: string;
  challenge: string;
  result: string;
}

export const SAMPLE_BUILDS: SampleBuild[] = [
  {
    slug: "launchpad",
    title: "Launchpad — SaaS waitlist",
    by: "linnea.dev",
    used: ["wipe-reveal", "halo-button", "tilt-card", "marquee-logos", "conic-loader"],
    kb: 41,
    note: "Wipe headline over a tilt signup card; the loader doubles as the 'saving' state. Five assets, one coherent dark product.",
    challenge: "A pre-launch SaaS had a two-line landing page and a conversion problem: nobody could picture the product, so nobody joined the waitlist.",
    result: "A single-screen build — a wipe-revealed headline, a tilt signup card, a logo strip for the 'trusted by' row and a loader that doubles as the saving state — lifted waitlist signups from 2.1% to 6.4% in the first month.",
  },
  {
    slug: "nightfolio",
    title: "Nightfolio — 3D portfolio",
    by: "mikef.builds",
    used: ["orbit-deck", "scramble-text", "star-motes", "flip-card"],
    kb: 34,
    note: "Orbit ring of case cards above a starfield; scramble reveals on scroll. Flip cards tuck the case notes out of sight.",
    challenge: "A developer's portfolio read like a résumé — bullet points and dates — and recruiters were not staying past the first screen.",
    result: "The rebuild turned the work into a night-sky scene: an orbit ring of case cards, scramble-text reveals, and flip cards that hide the details until you want them. Time-on-page tripled.",
  },
  {
    slug: "wavelength",
    title: "Wavelength — dev-tool landing",
    by: "studio.noir",
    used: ["morph-blob", "tab-morph", "chart-card", "counter-stats"],
    kb: 27,
    note: "Morph backdrop behind a tab-morph product tour; the momentum chart does the convincing where copy would oversell.",
    challenge: "A developer tool's landing page explained the product with adjectives; users could not tell what the tool measured or why it mattered.",
    result: "A data-first build — morphing backdrop, a tab-morph product tour and a live-feeling momentum chart — replaced the adjectives with evidence. Trial starts rose 31%.",
  },
];
