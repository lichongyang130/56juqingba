"use client";

// Original live demos for Motif UI. Every visual below is authored in-house;
// none of the code is taken from third-party component libraries.
//
// This file is the registry, not the scenes: each demo key maps to a dynamic
// import of the module that holds it, so a page downloads the set it renders
// and not the other 161. Before batch 85 the whole catalog was one 380,911-byte
// module, and every page that showed a single scene paid for all of them: the
// component detail page carried 1,112.4 KB of JavaScript for one component
// (measured by scripts/measure-build.mjs before and after the split; it is
// 696.2 KB now).
//
// The rules that keep this honest: the loader map below names every key exactly
// once and points at a module that exports the scene by name; check:demos fails
// if either half of that drifts; the per-route budgets are re-measured after the
// split rather than assumed from it.

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { KeyframesStyle } from "@/components/keyframes";
import type { DemoProps } from "./scene-kit";

export { KeyframesStyle };
export type { DemoProps };

/* ------------------------------ REGISTRY ------------------------------ */

// Every key maps to a dynamic import of the module that holds it: the seven
// scene sets under scenes/, or scenes-17.tsx, which keeps the section 17 scenes
// in one module because they share their own helpers. Nothing here imports a
// scene statically — a static import is exactly what would put every scene back
// on every page that shows one.

// Exported because the keys are the catalog's demo vocabulary, not a private
// detail: the props panel and the harness both want the same list.
export const DEMO_KEYS = [
  "prism-switch", "halo-button", "pulse-loader", "nav-dock",
  "aurora-veil", "halo-trail", "orbit-deck", "star-motes", "scramble-text", "tilt-card",
  "hero-aurora", "bento-studio", "marquee-logos", "faq-orbit",
  "glass", "noise", "grid", "sorbet", "halftone", "ink",
  "morph-blob", "conic-loader", "glass-pricing", "wipe-reveal", "counter-stats", "dot-draw",
  "text-cycle", "tab-morph", "flip-card", "skeleton-shimmer", "chart-card", "avatar-stack",
  "command-palette", "toast-stack", "sheet-menu",
  "segmented-control", "notification-bell", "scroll-progress", "testimonial-rotator",
  "countdown-drop", "terminal-hero", "polaroid-stack", "team-spotlight",
  "combo-box", "odometer-counter", "star-rating", "tag-input",
  "slider-ticks", "checkbox-card", "quantity-stepper", "radio-pills",
  "auto-grow-textarea", "date-presets", "file-drop-zone", "toggle-label-stack",
  "password-strength", "split-button-menu", "breadcrumb-trail",
  "reorder-list", "swipe-deck", "split-pane",
  "zoom-lens", "chart-scrubber", "scroll-pin",
  "flip-stack", "draw-path", "morph-icons",
  "logo-chase", "shimmer-text", "ring-ticks",
  "bezier-drawer", "counter-band", "linked-cards",
  "share-sheet", "theme-drop", "search-walk",
  "reading-dots", "pulse-graph", "easing-icons",
  "preloader-handoff", "ripple-dots", "tilted-cta", "success-burst",
  "slug-field",
  "pagination-ellipsis", "toc-spine", "tabs-indicator", "sticky-subnav",
  "back-to-top", "disclosure-list", "fullscreen-overlay-menu", "skeleton-card",
  "status-banner", "progress-ring", "spinner-status", "empty-state-trio",
  "offline-indicator", "error-boundary-card", "confetti-burst",
  "dot-leader-loading", "live-region-demo", "liquid-button-hover", "magnetic-icon-row",
  "scroll-linked-hue-hero", "staggered-list-entrance", "shuffle-kenburns-gallery", "particle-trail-hero",
  "ink-stamp-appear", "gradient-border-flow", "ripple-reveal", "parallax-layered-scene",
  "scroll-vignette", "word-by-word-highlight", "shake-on-error-field", "bento-feature-grid",
  "logo-wall-hover-pop", "testimonial-marquee", "pricing-table-three", "stats-band",
  "team-grid-filter", "faq-two-column", "comparison-slider", "timeline-vertical",
  "newsletter-band-tiers", "hero-product-mock", "split-feature-rows", "case-study-header",
  "changelog-feed", "resource-download-cards", "event-schedule-list", "map-free-local-band",
  "app-screenshot-tour", "template-docs-site", "template-landing-saas", "template-waitlist",
  "template-changelog", "template-gallery",
  "topographic-contours", "blueprint-grid", "confetti-field", "bokeh-depth-field",
  "glass-shards", "lava-lamp-blobs", "paper-grain", "silk-wave",
  "star-field-parallax", "scanline-crt", "liquid-mesh", "dot-matrix",
  "brushed-metal", "carbon-fibre", "water-ripple", "ink-bloom",
  "aurora-band", "noise-storm", "glass-distortion", "ember-rise",
  "checkerboard-fade", "plaid-weave", "halftone-burst", "cloud-drift", "sunset-horizon",
] as const;

export type DemoKey = (typeof DEMO_KEYS)[number];

/** One loader per key. Static so the bundler can see every import: a computed
 *  path here would pull all the sets back into every page, which is the problem
 *  this registry exists to solve. */
const SCENE_LOADERS: Record<DemoKey, () => Promise<{ default: ComponentType<DemoProps> }>> = {
  "prism-switch": () => import("./scenes/set-01").then((m) => ({ default: m.PrismSwitch })),
  "halo-button": () => import("./scenes/set-01").then((m) => ({ default: m.HaloButton })),
  "pulse-loader": () => import("./scenes/set-01").then((m) => ({ default: m.PulseLoader })),
  "nav-dock": () => import("./scenes/set-01").then((m) => ({ default: m.NavDock })),
  "aurora-veil": () => import("./scenes/set-01").then((m) => ({ default: m.AuroraVeil })),
  "halo-trail": () => import("./scenes/set-01").then((m) => ({ default: m.HaloTrail })),
  "orbit-deck": () => import("./scenes/set-01").then((m) => ({ default: m.OrbitDeck })),
  "star-motes": () => import("./scenes/set-01").then((m) => ({ default: m.StarMotes })),
  "scramble-text": () => import("./scenes/set-01").then((m) => ({ default: m.ScrambleText })),
  "tilt-card": () => import("./scenes/set-01").then((m) => ({ default: m.TiltCard })),
  "hero-aurora": () => import("./scenes/set-01").then((m) => ({ default: m.HeroAurora })),
  "bento-studio": () => import("./scenes/set-01").then((m) => ({ default: m.BentoStudio })),
  "marquee-logos": () => import("./scenes/set-01").then((m) => ({ default: m.MarqueeLogos })),
  "faq-orbit": () => import("./scenes/set-01").then((m) => ({ default: m.FaqOrbit })),
  "glass": () => import("./scenes/set-01").then((m) => ({ default: m.BgLiquidGlass })),
  "noise": () => import("./scenes/set-01").then((m) => ({ default: m.BgNoise })),
  "grid": () => import("./scenes/set-01").then((m) => ({ default: m.BgGrid })),
  "sorbet": () => import("./scenes/set-01").then((m) => ({ default: m.BgSorbet })),
  "halftone": () => import("./scenes/set-01").then((m) => ({ default: m.BgHalftone })),
  "ink": () => import("./scenes/set-01").then((m) => ({ default: m.BgInk })),
  "morph-blob": () => import("./scenes/set-01").then((m) => ({ default: m.MorphBlob })),
  "conic-loader": () => import("./scenes/set-01").then((m) => ({ default: m.ConicLoader })),
  "glass-pricing": () => import("./scenes/set-01").then((m) => ({ default: m.GlassPricing })),
  "wipe-reveal": () => import("./scenes/set-01").then((m) => ({ default: m.WipeReveal })),
  "counter-stats": () => import("./scenes/set-01").then((m) => ({ default: m.CounterStats })),
  "dot-draw": () => import("./scenes/set-01").then((m) => ({ default: m.DotDraw })),
  "text-cycle": () => import("./scenes/set-01").then((m) => ({ default: m.TextCycle })),
  "tab-morph": () => import("./scenes/set-01").then((m) => ({ default: m.TabMorph })),
  "flip-card": () => import("./scenes/set-01").then((m) => ({ default: m.FlipCard })),
  "skeleton-shimmer": () => import("./scenes/set-02").then((m) => ({ default: m.SkeletonShimmer })),
  "chart-card": () => import("./scenes/set-02").then((m) => ({ default: m.ChartCard })),
  "avatar-stack": () => import("./scenes/set-02").then((m) => ({ default: m.AvatarStack })),
  "command-palette": () => import("./scenes/set-02").then((m) => ({ default: m.CommandPalette })),
  "toast-stack": () => import("./scenes/set-02").then((m) => ({ default: m.ToastStack })),
  "sheet-menu": () => import("./scenes/set-02").then((m) => ({ default: m.SheetMenu })),
  "segmented-control": () => import("./scenes/set-02").then((m) => ({ default: m.SegmentedControl })),
  "notification-bell": () => import("./scenes/set-02").then((m) => ({ default: m.NotificationBell })),
  "scroll-progress": () => import("./scenes/set-02").then((m) => ({ default: m.ScrollProgress })),
  "testimonial-rotator": () => import("./scenes/set-02").then((m) => ({ default: m.TestimonialRotator })),
  "countdown-drop": () => import("./scenes/set-02").then((m) => ({ default: m.CountdownDrop })),
  "terminal-hero": () => import("./scenes/set-02").then((m) => ({ default: m.TerminalHero })),
  "polaroid-stack": () => import("./scenes/set-02").then((m) => ({ default: m.PolaroidStack })),
  "team-spotlight": () => import("./scenes/set-02").then((m) => ({ default: m.TeamSpotlightGrid })),
  "combo-box": () => import("./scenes/set-02").then((m) => ({ default: m.ComboBox })),
  "odometer-counter": () => import("./scenes/set-02").then((m) => ({ default: m.OdometerCounter })),
  "star-rating": () => import("./scenes/set-02").then((m) => ({ default: m.StarRating })),
  "tag-input": () => import("./scenes/set-03").then((m) => ({ default: m.TagInput })),
  "slider-ticks": () => import("./scenes/set-03").then((m) => ({ default: m.SliderWithTicks })),
  "checkbox-card": () => import("./scenes/set-03").then((m) => ({ default: m.CheckboxCard })),
  "quantity-stepper": () => import("./scenes/set-03").then((m) => ({ default: m.QuantityStepper })),
  "radio-pills": () => import("./scenes/set-03").then((m) => ({ default: m.RadioPills })),
  "auto-grow-textarea": () => import("./scenes/set-03").then((m) => ({ default: m.AutoGrowTextarea })),
  "date-presets": () => import("./scenes/set-03").then((m) => ({ default: m.DatePresetsPicker })),
  "file-drop-zone": () => import("./scenes/set-03").then((m) => ({ default: m.FileDropZone })),
  "toggle-label-stack": () => import("./scenes/set-03").then((m) => ({ default: m.ToggleLabelStack })),
  "password-strength": () => import("./scenes/set-03").then((m) => ({ default: m.PasswordStrength })),
  "split-button-menu": () => import("./scenes/set-03").then((m) => ({ default: m.SplitButtonMenu })),
  "breadcrumb-trail": () => import("./scenes/set-03").then((m) => ({ default: m.BreadcrumbTrail })),
  "reorder-list": () => import("./scenes-17").then((m) => ({ default: m.ReorderList })),
  "swipe-deck": () => import("./scenes-17").then((m) => ({ default: m.SwipeDeck })),
  "split-pane": () => import("./scenes-17").then((m) => ({ default: m.SplitPane })),
  "zoom-lens": () => import("./scenes-17").then((m) => ({ default: m.ZoomLens })),
  "chart-scrubber": () => import("./scenes-17").then((m) => ({ default: m.ChartScrubber })),
  "scroll-pin": () => import("./scenes-17").then((m) => ({ default: m.ScrollPin })),
  "flip-stack": () => import("./scenes-17").then((m) => ({ default: m.FlipStack })),
  "draw-path": () => import("./scenes-17").then((m) => ({ default: m.DrawOnScroll })),
  "morph-icons": () => import("./scenes-17").then((m) => ({ default: m.MorphIcons })),
  "logo-chase": () => import("./scenes-17").then((m) => ({ default: m.InfiniteChase })),
  "shimmer-text": () => import("./scenes-17").then((m) => ({ default: m.ShimmerReveal })),
  "ring-ticks": () => import("./scenes-17").then((m) => ({ default: m.AuditRing })),
  "bezier-drawer": () => import("./scenes-17").then((m) => ({ default: m.BezierDrawer })),
  "counter-band": () => import("./scenes-17").then((m) => ({ default: m.CounterBand })),
  "linked-cards": () => import("./scenes-17").then((m) => ({ default: m.LinkedCards })),
  "share-sheet": () => import("./scenes-17").then((m) => ({ default: m.ShareSheet })),
  "theme-drop": () => import("./scenes-17").then((m) => ({ default: m.ThemeDrop })),
  "search-walk": () => import("./scenes-17").then((m) => ({ default: m.SearchWalk })),
  "reading-dots": () => import("./scenes-17").then((m) => ({ default: m.ReadingDots })),
  "pulse-graph": () => import("./scenes-17").then((m) => ({ default: m.PulseGraph })),
  "easing-icons": () => import("./scenes-17").then((m) => ({ default: m.EasingIcons })),
  "preloader-handoff": () => import("./scenes-17").then((m) => ({ default: m.PreloaderHandoff })),
  "ripple-dots": () => import("./scenes-17").then((m) => ({ default: m.RippleDots })),
  "tilted-cta": () => import("./scenes-17").then((m) => ({ default: m.TiltedCta })),
  "success-burst": () => import("./scenes-17").then((m) => ({ default: m.SuccessBurst })),
  "slug-field": () => import("./scenes-17").then((m) => ({ default: m.SlugField })),
  "pagination-ellipsis": () => import("./scenes/set-03").then((m) => ({ default: m.PaginationEllipsis })),
  "toc-spine": () => import("./scenes/set-03").then((m) => ({ default: m.TocSpine })),
  "tabs-indicator": () => import("./scenes/set-03").then((m) => ({ default: m.TabsIndicator })),
  "sticky-subnav": () => import("./scenes/set-03").then((m) => ({ default: m.StickySubNav })),
  "back-to-top": () => import("./scenes/set-03").then((m) => ({ default: m.BackToTop })),
  "disclosure-list": () => import("./scenes/set-04").then((m) => ({ default: m.DisclosureList })),
  "fullscreen-overlay-menu": () => import("./scenes/set-04").then((m) => ({ default: m.FullscreenOverlayMenu })),
  "skeleton-card": () => import("./scenes/set-04").then((m) => ({ default: m.SkeletonCard })),
  "status-banner": () => import("./scenes/set-04").then((m) => ({ default: m.StatusBanner })),
  "progress-ring": () => import("./scenes/set-04").then((m) => ({ default: m.ProgressRing })),
  "spinner-status": () => import("./scenes/set-04").then((m) => ({ default: m.SpinnerStatus })),
  "empty-state-trio": () => import("./scenes/set-04").then((m) => ({ default: m.EmptyStateTrio })),
  "offline-indicator": () => import("./scenes/set-04").then((m) => ({ default: m.OfflineIndicator })),
  "error-boundary-card": () => import("./scenes/set-04").then((m) => ({ default: m.ErrorBoundaryCard })),
  "confetti-burst": () => import("./scenes/set-04").then((m) => ({ default: m.ConfettiBurst })),
  "dot-leader-loading": () => import("./scenes/set-04").then((m) => ({ default: m.DotLeaderLoading })),
  "live-region-demo": () => import("./scenes/set-04").then((m) => ({ default: m.LiveRegionDemo })),
  "liquid-button-hover": () => import("./scenes/set-04").then((m) => ({ default: m.LiquidButtonHover })),
  "magnetic-icon-row": () => import("./scenes/set-04").then((m) => ({ default: m.MagneticIconRow })),
  "scroll-linked-hue-hero": () => import("./scenes/set-04").then((m) => ({ default: m.ScrollLinkedHueHero })),
  "staggered-list-entrance": () => import("./scenes/set-04").then((m) => ({ default: m.StaggeredListEntrance })),
  "shuffle-kenburns-gallery": () => import("./scenes/set-05").then((m) => ({ default: m.ShuffleKenburnsGallery })),
  "particle-trail-hero": () => import("./scenes/set-05").then((m) => ({ default: m.ParticleTrailHero })),
  "ink-stamp-appear": () => import("./scenes/set-05").then((m) => ({ default: m.InkStampAppear })),
  "gradient-border-flow": () => import("./scenes/set-05").then((m) => ({ default: m.GradientBorderFlow })),
  "ripple-reveal": () => import("./scenes/set-05").then((m) => ({ default: m.RippleReveal })),
  "parallax-layered-scene": () => import("./scenes/set-05").then((m) => ({ default: m.ParallaxLayeredScene })),
  "scroll-vignette": () => import("./scenes/set-05").then((m) => ({ default: m.ScrollVignette })),
  "word-by-word-highlight": () => import("./scenes/set-05").then((m) => ({ default: m.WordHighlight })),
  "shake-on-error-field": () => import("./scenes/set-05").then((m) => ({ default: m.ShakeField })),
  "bento-feature-grid": () => import("./scenes/set-05").then((m) => ({ default: m.BentoFeatureGrid })),
  "logo-wall-hover-pop": () => import("./scenes/set-05").then((m) => ({ default: m.LogoWallHoverPop })),
  "testimonial-marquee": () => import("./scenes/set-05").then((m) => ({ default: m.TestimonialMarquee })),
  "pricing-table-three": () => import("./scenes/set-05").then((m) => ({ default: m.PricingTableThree })),
  "stats-band": () => import("./scenes/set-05").then((m) => ({ default: m.StatsBand })),
  "team-grid-filter": () => import("./scenes/set-05").then((m) => ({ default: m.TeamGridFilter })),
  "faq-two-column": () => import("./scenes/set-06").then((m) => ({ default: m.FaqTwoColumn })),
  "comparison-slider": () => import("./scenes/set-06").then((m) => ({ default: m.ComparisonSlider })),
  "timeline-vertical": () => import("./scenes/set-06").then((m) => ({ default: m.TimelineVertical })),
  "newsletter-band-tiers": () => import("./scenes/set-06").then((m) => ({ default: m.NewsletterBandTiers })),
  "hero-product-mock": () => import("./scenes/set-06").then((m) => ({ default: m.HeroProductMock })),
  "split-feature-rows": () => import("./scenes/set-06").then((m) => ({ default: m.SplitFeatureRows })),
  "case-study-header": () => import("./scenes/set-06").then((m) => ({ default: m.CaseStudyHeader })),
  "changelog-feed": () => import("./scenes/set-06").then((m) => ({ default: m.ChangelogFeed })),
  "resource-download-cards": () => import("./scenes/set-06").then((m) => ({ default: m.ResourceDownloadCards })),
  "event-schedule-list": () => import("./scenes/set-06").then((m) => ({ default: m.EventScheduleList })),
  "map-free-local-band": () => import("./scenes/set-06").then((m) => ({ default: m.MapFreeLocalBand })),
  "app-screenshot-tour": () => import("./scenes/set-06").then((m) => ({ default: m.AppScreenshotTour })),
  "template-docs-site": () => import("./scenes/set-06").then((m) => ({ default: m.TemplateDocsSite })),
  "template-landing-saas": () => import("./scenes/set-06").then((m) => ({ default: m.TemplateLandingSaas })),
  "template-waitlist": () => import("./scenes/set-06").then((m) => ({ default: m.TemplateWaitlist })),
  "template-changelog": () => import("./scenes/set-06").then((m) => ({ default: m.TemplateChangelogJournal })),
  "template-gallery": () => import("./scenes/set-07").then((m) => ({ default: m.TemplateGallery })),
  "topographic-contours": () => import("./scenes/set-07").then((m) => ({ default: m.TopographicContours })),
  "blueprint-grid": () => import("./scenes/set-07").then((m) => ({ default: m.BlueprintGrid })),
  "confetti-field": () => import("./scenes/set-07").then((m) => ({ default: m.ConfettiField })),
  "bokeh-depth-field": () => import("./scenes/set-07").then((m) => ({ default: m.BokehDepthField })),
  "glass-shards": () => import("./scenes/set-07").then((m) => ({ default: m.GlassShards })),
  "lava-lamp-blobs": () => import("./scenes/set-07").then((m) => ({ default: m.LavaLampBlobs })),
  "paper-grain": () => import("./scenes/set-07").then((m) => ({ default: m.PaperGrain })),
  "silk-wave": () => import("./scenes/set-07").then((m) => ({ default: m.SilkWave })),
  "star-field-parallax": () => import("./scenes/set-07").then((m) => ({ default: m.StarFieldParallax })),
  "scanline-crt": () => import("./scenes/set-07").then((m) => ({ default: m.ScanlineCrt })),
  "liquid-mesh": () => import("./scenes/set-07").then((m) => ({ default: m.LiquidMesh })),
  "dot-matrix": () => import("./scenes/set-07").then((m) => ({ default: m.DotMatrix })),
  "brushed-metal": () => import("./scenes/set-07").then((m) => ({ default: m.BrushedMetal })),
  "carbon-fibre": () => import("./scenes/set-07").then((m) => ({ default: m.CarbonFibre })),
  "water-ripple": () => import("./scenes/set-07").then((m) => ({ default: m.WaterRipple })),
  "ink-bloom": () => import("./scenes/set-07").then((m) => ({ default: m.InkBloom })),
  "aurora-band": () => import("./scenes/set-07").then((m) => ({ default: m.AuroraBand })),
  "noise-storm": () => import("./scenes/set-07").then((m) => ({ default: m.NoiseStorm })),
  "glass-distortion": () => import("./scenes/set-07").then((m) => ({ default: m.GlassDistortion })),
  "ember-rise": () => import("./scenes/set-07").then((m) => ({ default: m.EmberRise })),
  "checkerboard-fade": () => import("./scenes/set-07").then((m) => ({ default: m.CheckerboardFade })),
  "plaid-weave": () => import("./scenes/set-07").then((m) => ({ default: m.PlaidWeave })),
  "halftone-burst": () => import("./scenes/set-07").then((m) => ({ default: m.HalftoneBurst })),
  "cloud-drift": () => import("./scenes/set-07").then((m) => ({ default: m.CloudDrift })),
  "sunset-horizon": () => import("./scenes/set-07").then((m) => ({ default: m.SunsetHorizon })),
};

/** One `dynamic()` call per key, made once when this module loads. Calling it
 *  during render would build a new component identity on every render, which
 *  remounts the scene and restarts its timers — and a cache around it does not
 *  make that correct, it only hides it. `ssr: true` keeps the scene in the
 *  server-rendered HTML, so the demo is still in the document a crawler or a
 *  JS-off browser receives; only the module is fetched lazily. */
const SCENE_COMPONENTS = Object.fromEntries(
  (Object.keys(SCENE_LOADERS) as DemoKey[]).map((key) => [key, dynamic(SCENE_LOADERS[key], { ssr: true })]),
) as Record<DemoKey, ComponentType<DemoProps>>;

export function DemoView({ demo, props = {} }: { demo: string; props?: DemoProps }) {
  const Scene = SCENE_COMPONENTS[demo as DemoKey];
  if (!Scene) return null;
  return <Scene {...props} />;
}
