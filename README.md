# Motif UI (working title) — MVP

> One open platform for the front of the web: original animated components, AI website prompts
> with **real multi-model test scores**, backgrounds and interactive motion labs —
> with a full public site **and** an admin console.

Product & strategy: see **[docs/product-plan.md](docs/product-plan.md)** (positioning vs Motion
Sites / React Bits / Uiverse / Anime.js / Aceternity UI, IA for front + back office, data model,
monetization, roadmap).

> Brand is a placeholder — change it in one place: `src/lib/site.ts`.

---

## What's built (working demo, all content original)

| Route | What it shows |
|---|---|
| `/` | Marketing home — live component previews, verified-prompt scoreboard concept, differentiators |
| `/components` | Library with kind / stack filters, search, sort (elements · animated · sections · templates) |
| `/components/[slug]` | **Live playground**: drag/hover demos, prop knobs, theme-tone slider, audit report, React/CSS code with copy |
| `/prompts` | AI prompt library — every prompt card carries measured fidelity + models run |
| `/prompts/[slug]` | Full prompt text + per-model **run log** (scores, build errors, recovery notes) |
| `/backgrounds` | CSS/WebGL texture & motion background gallery with performance tiers |
| `/lab` | Interactive original tools: **Easing Lab**, **Spring Lab** (real mass–spring–damper), **Scroll Lab**, **Gradient Forge** |
| `/learn` | Original editorial guides — hero build-along, easing field guide, prompt structure, a11y checklist |
| `/pricing` | Freemium tiers (Free / Pro / Team) |
| `/admin` | Admin console: dashboard, assets lifecycle, prompt release + re-test queue, moderation desk, settings |

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4
- Prisma 8 (schema only for now — see below)
- Zero database required for the demo: pages run on typed mock content in `src/lib/data.ts`

## Run it

```bash
npm install
npm run dev          # http://localhost:3000  (admin at /admin)
npm run typecheck    # TS check
npm run lint
```

## Repository map

```
docs/product-plan.md        full product plan (this repo is the plan's MVP skeleton)
prisma/schema.prisma        production data model (User/Asset/AssetVersion/PromptTemplate/
                            PromptRun/Submission/Order/AuditLog… mirrors src/lib/types.ts)
src/lib/site.ts             brand config (rename the whole site here)
src/lib/types.ts            shared domain types
src/lib/data.ts             demo dataset (original content only)
src/components/demos        hand-built live demos rendered in cards & playgrounds
src/components/lab-tools.ts interactive Easing / Spring / Gradient tools
src/components/cards.tsx    asset / prompt / background / tool cards
src/components/chrome.tsx   public header, search, footer
src/components/admin-ui.tsx admin shell (sidebar + topbar)
src/app/(public)/…          public site routes
src/app/admin/…             admin console routes
.env.example                env template (DB, auth, Stripe, AI keys)
```

## Demo vs production

- **Demo now:** public + admin UI, live playgrounds, working interactive labs, filters, copies,
  mock moderation flows — no backend, no auth, no payments.
- **To production:** wire Postgres (`npm run db:setup`), Auth.js, the Prisma models, Stripe,
  R2 media, an AI-testing worker that fills `PromptRun`, and the sandboxed iframe preview
  described in the plan.

## License note

All code, copy and demos in this MVP are original Motif UI content. Product strategy is MIT-style
for assets and CC BY 4.0 for guides — do not copy content from competitor sites.
