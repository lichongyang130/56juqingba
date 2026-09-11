export const dynamic = "force-static";

/**
 * #497 — the one-tag embed SDK.
 *
 * Drop this on a page, add a placeholder, done:
 *
 *   <script src="https://motifui.dev/embed.js" defer></script>
 *   <div data-motif-embed="halo-button" data-height="280"></div>
 *
 * The script does one thing: it finds those placeholders and puts the existing
 * /embed/<slug> iframe inside, at the height the attribute asks for (default
 * 320). No analytics, no backlink injection, no global namespace beyond the
 * function it exposes for late-added nodes.
 */

const SCRIPT = `/* Motif UI embed SDK — #497. One job: placeholders become iframes. */
(function () {
  var DEFAULT_HEIGHT = 320;
  function mount(node) {
    if (node.getAttribute("data-motif-mounted")) return;
    var slug = node.getAttribute("data-motif-embed");
    if (!slug) return;
    var height = parseInt(node.getAttribute("data-height") || "", 10) || DEFAULT_HEIGHT;
    var frame = document.createElement("iframe");
    frame.src = "https://motifui.dev/embed/" + encodeURIComponent(slug);
    frame.title = node.getAttribute("data-title") || "Motif UI embed: " + slug;
    frame.loading = "lazy";
    frame.style.width = "100%";
    frame.style.height = height + "px";
    frame.style.border = "0";
    frame.style.borderRadius = "12px";
    frame.setAttribute("allowfullscreen", "");
    node.setAttribute("data-motif-mounted", "1");
    node.appendChild(frame);
  }
  function scan(root) {
    var list = (root || document).querySelectorAll("[data-motif-embed]");
    for (var i = 0; i < list.length; i++) mount(list[i]);
  }
  window.MotifEmbed = { mount: mount, scan: scan };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { scan(); });
  else scan();
})();
`;

export async function GET() {
  return new Response(SCRIPT, {
    headers: {
      "content-type": "application/javascript; charset=utf-8",
      "cache-control": "public, max-age=3600",
      "x-sdk-version": "1",
    },
  });
}
