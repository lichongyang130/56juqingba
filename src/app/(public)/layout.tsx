import { CtaRail, Footer, Header } from "@/components/chrome";
import { ReturningCue } from "@/components/home-cues";
import { BACKGROUNDS, CHANGELOG, COMPONENTS, PROMPTS } from "@/lib/data";
import { LEARN_ARTICLES } from "@/lib/learn";
import { KeyframesStyle } from "@/components/keyframes";

/** The footer and the CTA rail quote catalog counts. Deriving them here keeps a
 *  new asset from leaving a stale number in the chrome, which is the one place
 *  a wrong count is visible on every page. */
const COUNTS = {
  components: COMPONENTS.length,
  prompts: PROMPTS.length,
  guides: LEARN_ARTICLES.length,
  backgrounds: BACKGROUNDS.length,
  asOf: CHANGELOG.reduce((latest, e) => (e.date > latest ? e.date : latest), ""),
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-bg text-ink">
      <KeyframesStyle />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer counts={COUNTS} />
      <CtaRail counts={COUNTS} />
      <ReturningCue entries={CHANGELOG} />
    </div>
  );
}
