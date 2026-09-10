import { CtaRail, Footer, Header } from "@/components/chrome";
import { ReturningCue } from "@/components/home-cues";
import { CHANGELOG } from "@/lib/data";
import { KeyframesStyle } from "@/components/keyframes";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-bg text-ink">
      <KeyframesStyle />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CtaRail />
      <ReturningCue entries={CHANGELOG} />
    </div>
  );
}
