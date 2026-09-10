// The animation keyframes every demo shares.
//
// This lives in its own module because of a measured problem: the public layout
// needs <KeyframesStyle />, and it used to import it from cards.tsx, which
// imports the 7,416-line demo module. Every route in the (public) group — the
// guide pages, the community pages, the audit pages — therefore shipped the
// whole of Demo.tsx in its client bundle whether or not it rendered a demo.
// The budget report put it at ~485 KB of JavaScript on pages with no demos.
//
// Keeping the keyframes here means a page pays for the demos only when it
// actually renders one.

const KEYFRAMES = `
  @keyframes mf-dot { 0%,100% { transform: scale(0.55); opacity:.35 } 40% { transform: scale(1); opacity:1 } }
  @keyframes mf-spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
  @keyframes mf-scramble { to { filter: blur(0) } }
  @keyframes mf-gridmove { from { background-position: 0 0 } to { background-position: 0 -48px } }
  @keyframes mf-glow { 0%,100% { opacity:.5; transform: scale(1)} 50% { opacity:.9; transform: scale(1.18)} }
  @keyframes mf-rise { from { opacity:0; transform: translateY(14px)} to { opacity:1; transform:none} }
  @keyframes mf-bob { 0%,100%{ transform: translateY(0) rotate(-1deg)} 50%{ transform: translateY(-10px) rotate(1.5deg)} }
  @keyframes mf-roll { from { transform: translateY(-130%); opacity: 0 } to { transform: none; opacity: 1 } }
  @keyframes mf-pop { 0% { transform: scale(.6); opacity: 0 } 65% { transform: scale(1.08); opacity: 1 } 100% { transform: none; opacity: 1 } }
  @keyframes mf-draw { to { stroke-dashoffset: 0 } }
  @keyframes mf-growin { from { opacity: 0; transform: scale(.96) translateY(4px) } to { opacity: 1; transform: none } }
  @keyframes mf-fade { from { opacity: 0 } to { opacity: 1 } }
  @keyframes mf-liquid { 0% { transform: translate(-50%,-50%) scale(.12); opacity:.55 } 55% { transform: translate(-50%,-50%) scale(1.12); opacity:.5 } 100% { transform: translate(-50%,-50%) scale(2.9); opacity:0 } }
  @keyframes mf-kb-l { from { transform: scale(1) translate(0,0) } to { transform: scale(1.16) translate(-3.5%,-2.5%) } }
  @keyframes mf-kb-r { from { transform: scale(1) translate(0,0) } to { transform: scale(1.16) translate(3.5%,2.5%) } }
  @keyframes mf-sparkle { 0% { opacity:1; transform: translate(0,0) scale(var(--ss,1)) } 100% { opacity:0; transform: translate(var(--sdx,0px),var(--sdy,26px)) scale(.15) } }
  @keyframes mf-stamp { 0% { transform: scale(.6) rotate(14deg); opacity:0 } 55% { transform: scale(1.06) rotate(-2.5deg); opacity:1 } 75% { transform: scale(.98) rotate(.8deg) } 100% { transform: scale(1) rotate(0); opacity:1 } }
  @keyframes mf-ripple { from { transform: translate(-50%,-50%) scale(.1); opacity:.6 } to { transform: translate(-50%,-50%) scale(1); opacity:0 } }
  @keyframes mf-shake { 10%,90% { transform: translateX(-1px) } 20%,80% { transform: translateX(2px) } 30%,50%,70% { transform: translateX(-3px) } 40%,60% { transform: translateX(3px) } }
  @keyframes mf-sway-a { 0%,100% { transform: translate(0,0) } 50% { transform: translate(9px,-12px) } }
  @keyframes mf-sway-b { 0%,100% { transform: translate(0,0) } 50% { transform: translate(-12px,7px) } }
@keyframes mf-marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
`;

export function KeyframesStyle() {
  return <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />;
}
