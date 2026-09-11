"use client";

// The bookmarklet link has to be built from the origin the reader is actually
// on, so it is assembled in the browser and written onto the anchor through a
// ref callback — no effect, no hydration mismatch, and no chance of publishing a
// bookmarklet that points at the wrong host.

export function BookmarkletInstall({ scriptUrl }: { scriptUrl: string }) {
  const loader = (origin: string) =>
    `javascript:(()=>{const s=document.createElement('script');s.src='${origin}${scriptUrl}?t='+Date.now();document.body.appendChild(s);})()`;

  return (
    <div className="rounded-3xl border border-white/8 bg-panel p-6">
      <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Install</p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <a
          ref={(el) => {
            if (el && typeof window !== "undefined") el.href = loader(window.location.origin);
          }}
          href="#install"
          onClick={(e) => e.preventDefault()}
          className="btn btn-primary !px-5 !py-2.5 text-sm"
        >
          Read palette
        </a>
        <span className="text-[11px] leading-relaxed text-ink-dim">
          Drag this button to your bookmarks bar — or on a touch device, bookmark this page and replace the bookmark&apos;s
          address with the code below.
        </span>
      </div>
      <pre className="mt-3 overflow-auto rounded-2xl border border-white/8 bg-[#07090f] p-4 font-mono text-[10px] leading-relaxed text-ink-dim">{`javascript:(()=>{const s=document.createElement('script');
  s.src='<this site>/api/exports/motif-bookmarklet.js?t='+Date.now();
  document.body.appendChild(s);})()`}</pre>
      <p className="mt-2 text-[10px] leading-relaxed text-ink-faint">
        The button above is wired to the origin you are reading this on, so the same page works on a preview, on localhost or on
        a deployed host. The snippet shown here has the host blanked out on purpose — a copy with the wrong domain in it is a
        bookmarklet that fails silently.
      </p>
    </div>
  );
}
