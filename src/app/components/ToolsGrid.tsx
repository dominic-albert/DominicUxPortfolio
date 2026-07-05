import { useEdit } from "./EditContext";
import { TOOL_DEFS } from "../data/tools";

/* ─────────────────────────────────────────────────────────────
   ToolsGrid — 4×4 transparent logo grid, normal display size.
   Custom image URLs are stored in EditContext ("toolUrls").
───────────────────────────────────────────────────────────── */

/* ── Logo SVGs (white, 40 × 40 viewBox) ─────────────────────── */
const FigmaLogo = () => (
  <svg viewBox="0 0 38 57" fill="none" className="w-9 h-12">
    <path d="M0 9.5C0 4.25 4.25 0 9.5 0H19v19H9.5C4.25 19 0 14.75 0 9.5Z" fill="white" opacity="0.95"/>
    <path d="M19 0h9.5C33.75 0 38 4.25 38 9.5S33.75 19 28.5 19H19V0Z" fill="white" opacity="0.80"/>
    <path d="M0 28.5C0 23.25 4.25 19 9.5 19H19v19H9.5C4.25 38 0 33.75 0 28.5Z" fill="white" opacity="0.65"/>
    <circle cx="28.5" cy="28.5" r="9.5" fill="white" opacity="0.90"/>
    <path d="M0 47.5C0 42.25 4.25 38 9.5 38H19v9.5C19 52.75 14.75 57 9.5 57S0 52.75 0 47.5Z" fill="white" opacity="0.55"/>
  </svg>
);
const MiroLogo = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
    <polyline points="4,44 4,4 24,22 44,4 44,44" stroke="white" strokeWidth="5.5" strokeLinejoin="round" strokeLinecap="round" fill="none" opacity="0.85"/>
  </svg>
);
const NotionLogo = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
    <polyline points="6,44 6,4 42,44 42,4" stroke="white" strokeWidth="5.5" strokeLinejoin="round" strokeLinecap="round" fill="none" opacity="0.85"/>
    <line x1="6" y1="24" x2="42" y2="24" stroke="white" strokeWidth="5.5" strokeLinecap="round" opacity="0.85"/>
  </svg>
);
const SlackLogo = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" opacity="0.85">
    <rect x="6"  y="6"  width="14" height="4" rx="2" fill="white"/>
    <rect x="6"  y="14" width="14" height="4" rx="2" fill="white" opacity="0.6"/>
    <rect x="28" y="6"  width="14" height="4" rx="2" fill="white"/>
    <rect x="28" y="14" width="14" height="4" rx="2" fill="white" opacity="0.6"/>
    <rect x="6"  y="30" width="14" height="4" rx="2" fill="white" opacity="0.6"/>
    <rect x="6"  y="38" width="14" height="4" rx="2" fill="white"/>
    <rect x="28" y="30" width="14" height="4" rx="2" fill="white" opacity="0.6"/>
    <rect x="28" y="38" width="14" height="4" rx="2" fill="white"/>
    <rect x="22" y="6"  width="4" height="14" rx="2" fill="white" opacity="0.6"/>
    <rect x="22" y="28" width="4" height="14" rx="2" fill="white" opacity="0.6"/>
  </svg>
);
const CursorLogo = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" opacity="0.85">
    <path d="M24 4 L44 24 L24 44 L4 24 Z" stroke="white" strokeWidth="3.5" fill="none"/>
    <path d="M24 12 L36 24 L24 36" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);
const ReplitLogo = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" opacity="0.85">
    <path d="M6 36 Q6 6 24 12 Q42 18 42 6" stroke="white" strokeWidth="5" strokeLinecap="round" fill="none"/>
    <path d="M42 12 Q42 42 24 36 Q6 30 6 42" stroke="white" strokeWidth="5" strokeLinecap="round" fill="none"/>
  </svg>
);
const BalasamiqLogo = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" opacity="0.85">
    <path d="M16 8 L20 20 L32 16 L28 28 L40 32 L28 28 L32 40 L20 36 L16 48 L12 36 L0 40 L4 28 L0 16 L12 20 Z" stroke="white" strokeWidth="3" fill="none"/>
    <circle cx="24" cy="24" r="4" fill="white"/>
  </svg>
);
const LovableLogo = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" opacity="0.85">
    <circle cx="24" cy="24" r="20" stroke="white" strokeWidth="3.5"/>
    <path d="M20 16 L34 24 L20 32 Z" fill="white"/>
    <path d="M8 24 L14 24" stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
    <path d="M34 24 L40 24" stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
    <path d="M24 8 L24 14" stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
    <path d="M24 34 L24 40" stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
  </svg>
);
const ChatGPTLogo = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" opacity="0.85">
    <path d="M24 6C14 6 6 14 6 24C6 31 10 37 16 41 L16 34 C12 31 10 28 10 24 C10 16 16 10 24 10 C32 10 38 16 38 24 C38 28 36 31 32 34 L32 41 C38 37 42 31 42 24 C42 14 34 6 24 6Z" fill="white"/>
    <circle cx="24" cy="24" r="5" fill="none" stroke="white" strokeWidth="3"/>
  </svg>
);
const ClaudeLogo = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" opacity="0.85">
    <path d="M8 40 L24 8 L40 40" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <line x1="14" y1="28" x2="34" y2="28" stroke="white" strokeWidth="5" strokeLinecap="round"/>
  </svg>
);
const MazeLogo = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" opacity="0.85">
    <path d="M24 4 L44 24 L24 44 L4 24 Z" stroke="white" strokeWidth="3.5" fill="none"/>
    <path d="M24 4 L24 16 M24 32 L24 44" stroke="white" strokeWidth="3" strokeLinecap="round"/>
    <path d="M4 24 L16 24 M32 24 L44 24" stroke="white" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="24" cy="24" r="4" fill="white"/>
  </svg>
);
const GammaLogo = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" opacity="0.85">
    <path d="M24 4 C24 4 36 14 36 26 C36 33 31 38 24 38 C17 38 12 33 12 26 C12 22 14 18 14 18 C14 18 18 24 22 24 C22 24 20 16 24 4Z" fill="white"/>
    <path d="M24 30 C22 30 20 32 20 34 C20 36 22 38 24 38 C26 38 28 36 28 34 C28 32 26 30 24 30Z" fill="rgba(10,10,15,0.8)"/>
  </svg>
);
const GitHubLogo = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" opacity="0.85">
    <path fillRule="evenodd" clipRule="evenodd"
      d="M24 4C12.96 4 4 12.96 4 24C4 32.84 9.86 40.3 17.94 42.96C18.94 43.14 19.3 42.54 19.3 42.02C19.3 41.56 19.28 40.08 19.28 38.5C14 39.42 12.72 37.14 12.32 35.94C12.1 35.32 11.12 33.36 10.26 32.9C9.56 32.52 8.56 31.6 10.24 31.58C11.82 31.56 12.94 33.02 13.32 33.66C15.12 36.68 18.04 35.84 19.38 35.32C19.56 34.04 20.06 33.18 20.62 32.7C15.96 32.22 11.08 30.44 11.08 22.6C11.08 20.3 11.9 18.42 13.38 16.94C13.14 16.46 12.42 14.32 13.58 11.46C13.58 11.46 15.22 10.96 19.3 13.64C21.06 13.14 22.96 12.9 24.84 12.9C26.72 12.9 28.62 13.14 30.38 13.64C34.46 10.94 36.1 11.46 36.1 11.46C37.26 14.32 36.54 16.46 36.3 16.94C37.78 18.42 38.6 20.28 38.6 22.6C38.6 30.46 33.7 32.22 29.04 32.7C29.76 33.3 30.38 34.44 30.38 36.22C30.38 38.8 30.36 40.86 30.36 42.02C30.36 42.54 30.72 43.16 31.72 42.96C39.78 40.3 44 32.84 44 24C44 12.96 35.04 4 24 4Z"
      fill="white"
    />
  </svg>
);
const FramerLogo = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" opacity="0.85">
    <circle cx="24" cy="24" r="20" stroke="white" strokeWidth="3"/>
    <path d="M14 34 L34 14" stroke="white" strokeWidth="4.5" strokeLinecap="round"/>
    <path d="M14 24 L24 14" stroke="white" strokeWidth="4.5" strokeLinecap="round"/>
    <path d="M24 34 L34 24" stroke="white" strokeWidth="4.5" strokeLinecap="round"/>
  </svg>
);
const JiraLogo = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" opacity="0.85">
    <path d="M8 4 H40 L24 24 H40 L8 44 V24 H24 Z" fill="white"/>
  </svg>
);
const Attention_InsightLogo = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" opacity="0.85">
    <rect x="4"  y="20" width="8"  height="24" rx="2" fill="white"/>
    <rect x="16" y="12" width="8"  height="32" rx="2" fill="white" opacity="0.75"/>
    <rect x="28" y="6"  width="8"  height="38" rx="2" fill="white" opacity="0.60"/>
    <rect x="40" y="16" width="4"  height="28" rx="2" fill="white" opacity="0.45"/>
  </svg>
);

const LOGOS: Record<string, () => JSX.Element> = {
  figma:      FigmaLogo,
  miro:       MiroLogo,
  notion:     NotionLogo,
  slack:      SlackLogo,
  Cursor:     CursorLogo,
  Replit:     ReplitLogo,
  Balasamiq:     BalasamiqLogo,
  Lovable:    LovableLogo,
  chatgpt:    ChatGPTLogo,
  claude:     ClaudeLogo,
  maze:       MazeLogo,
  Gamma:      GammaLogo,
  github:     GitHubLogo,
  Framer:     FramerLogo,
  Jira:     JiraLogo,
  Attention_Insight:   Attention_InsightLogo,
};

/* ── Grid component ──────────────────────────────────────────── */
export function ToolsGrid() {
  const { isEditMode, content } = useEdit();
  const toolUrls: Record<string, string> = content.toolUrls || {};

  return (
    <div className="w-full grid grid-cols-4">
      {TOOL_DEFS.map((tool, i) => {
        const col      = i % 4;
        const row      = Math.floor(i / 4);
        const isLastCol = col === 3;
        const isLastRow = row === 3;
        const Logo     = LOGOS[tool.id];
        const customUrl = toolUrls[tool.id];

        return (
          <div
            key={tool.id}
            className="relative flex flex-col items-center justify-center gap-2 group pl-[8px] pr-[14px] py-[24px]"
            style={{
              background: "transparent",
              boxShadow: [
                !isLastCol && "inset -1px 0 0 rgba(255,255,255,0.09)",
                !isLastRow && "inset 0 -1px 0 rgba(255,255,255,0.09)",
              ].filter(Boolean).join(", ") || "none",
            }}
          >
            {customUrl ? (
              <img src={customUrl} alt={tool.name} className="w-10 h-10 object-contain m-[0px] rounded-[4px]" />
            ) : (
              <Logo />
            )}
            <span
              className="text-[10px] tracking-wide"
              style={{ color: "rgba(255,255,255,0.60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 500 }}
            >
              {tool.name}
            </span>

            {/* Edit mode indicator */}
            {isEditMode && (
              <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                style={{ background: "rgba(124,58,237,0.12)", border: "1px dashed rgba(167,139,250,0.4)" }}>
                <span className="text-[10px] text-accent" style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 600 }}>
                  Edit in Tools tab
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
