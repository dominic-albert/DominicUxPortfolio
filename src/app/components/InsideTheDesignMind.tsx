import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  MotionValue,
} from "motion/react";
import {
  Bell,
  ShieldCheck,
  BadgeCheck,
  Truck,
  Headphones,
  ChevronDown,
} from "lucide-react";
import designVideo from "../../imports/4326423-uhd_3840_2160_25fps.mp4";

/* ============================================================
   Inside the Design Mind
   scroll prompt → problem → noise → patterns → constellation →
   eureka → solution (holo cards) → outcome (video) → impact.
   Shares the Design-Process backdrop (#0A0A0F + grid + orbs).
   ============================================================ */

const ACCENT = "#7C3AED";

const rand = (seed: number) => {
  const x = Math.sin(seed * 999.13) * 43758.5453;
  return x - Math.floor(x);
};

type ClusterId =
  | "trust"
  | "pricing"
  | "nav"
  | "onboarding"
  | "decision"
  | "performance"
  | "support";

type ClusterDef = {
  id: ClusterId;
  label: string;
  x: number;
  y: number;
  color: string;
  snippet: string;
};
// Scattered organically — no symmetric rows so the web reads naturally
const clusters: ClusterDef[] = [
  {
    id: "trust",
    label: "Trust",
    x: 16,
    y: 44,
    color: "#A78BFA",
    snippet: "I wasn't sure it was secure. — 9 sessions",
  },
  {
    id: "pricing",
    label: "Pricing",
    x: 63,
    y: 36,
    color: "#22D3EE",
    snippet: "Pricing page · 37% drop-off",
  },
  {
    id: "nav",
    label: "Navigation",
    x: 81,
    y: 58,
    color: "#F472B6",
    snippet: "14s average hesitation before a click",
  },
  {
    id: "decision",
    label: "Decision Making",
    x: 42,
    y: 60,
    color: "#34D399",
    snippet: "Hover · scroll · leave · repeat",
  },
  {
    id: "onboarding",
    label: "Onboarding",
    x: 22,
    y: 74,
    color: "#FBBF24",
    snippet: "Setup abandoned at step 3 of 5",
  },
  {
    id: "performance",
    label: "Performance",
    x: 72,
    y: 78,
    color: "#60A5FA",
    snippet: "6s load — users gone before paint",
  },
  {
    id: "support",
    label: "Support",
    x: 48,
    y: 87,
    color: "#FB7185",
    snippet: "No one replied for 20 minutes.",
  },
];

const clusterPos: Record<ClusterId, { x: number; y: number }> =
  Object.fromEntries(
    clusters.map((c) => [c.id, { x: c.x, y: c.y }]),
  ) as any;

// Web-like: every node connects to 2-3 neighbours across the space,
// not a single hub — lines cross diagonally for an organic network feel.
const connections: [ClusterId, ClusterId][] = [
  ["trust", "pricing"],
  ["trust", "decision"],
  ["trust", "onboarding"],
  ["pricing", "nav"],
  ["pricing", "decision"],
  ["nav", "decision"],
  ["nav", "performance"],
  ["decision", "onboarding"],
  ["decision", "performance"],
  ["decision", "support"],
  ["onboarding", "support"],
  ["performance", "support"],
];

const baseFragments: { text: string; cluster: ClusterId }[] = [
  { text: "Abandoned checkout", cluster: "decision" },
  { text: "Users can't find pricing", cluster: "pricing" },
  { text: "Why is this so confusing?", cluster: "nav" },
  { text: "37% drop-off", cluster: "decision" },
  { text: "Support Ticket #291", cluster: "trust" },
  { text: "14 second hesitation", cluster: "decision" },
  { text: "Navigation issue", cluster: "nav" },
  { text: "Cart left at payment", cluster: "decision" },
  { text: "Feature request", cluster: "onboarding" },
  { text: "Negative review", cluster: "trust" },
  { text: "Session recording", cluster: "onboarding" },
  { text: "Is my data safe?", cluster: "trust" },
  { text: "Where do I start?", cluster: "onboarding" },
  { text: "Hidden total cost", cluster: "pricing" },
  { text: "Back-button loop", cluster: "nav" },
  { text: "Rage click ×4", cluster: "decision" },
  { text: "Unclear next step", cluster: "onboarding" },
  { text: "Too many options", cluster: "decision" },
  { text: "Refund request", cluster: "trust" },
  { text: "Compare plans?", cluster: "pricing" },
  { text: "Lost in the menu", cluster: "nav" },
  { text: "Charged twice?", cluster: "trust" },
  { text: "Page took 6s to load", cluster: "performance" },
  { text: "Laggy on mobile", cluster: "performance" },
  { text: "Spinner forever", cluster: "performance" },
  { text: "Search felt slow", cluster: "performance" },
  { text: "No one replied", cluster: "support" },
  { text: "Where's live chat?", cluster: "support" },
  { text: "FAQ didn't help", cluster: "support" },
  { text: "Waited 20 minutes", cluster: "support" },
];

const fragments = Array.from({ length: 38 }).map((_, i) => {
  const base = baseFragments[i % baseFragments.length];
  const target = clusterPos[base.cluster];
  const depth = 0.35 + rand(i + 1) * 0.65;
  const jx = (rand(i + 11) - 0.5) * 16;
  const jy = (rand(i + 23) - 0.5) * 16;
  return {
    id: i,
    text: base.text,
    scatterX: 6 + rand(i + 31) * 88,
    scatterY: 32 + rand(i + 47) * 60,
    targetX: target.x + jx,
    targetY: target.y + jy,
    depth,
    rot: (rand(i + 53) - 0.5) * 24,
    float: 3 + rand(i + 67) * 4,
  };
});

function Fragment({
  f,
  p,
  mx,
  my,
}: {
  f: (typeof fragments)[number];
  p: MotionValue<number>;
  mx: MotionValue<number>;
  my: MotionValue<number>;
}) {
  // drift to cluster happens AFTER the read pause (compressed range)
  const tx = useTransform(
    p,
    [0.28, 0.38],
    [`0vw`, `${f.targetX - f.scatterX}vw`],
  );
  const ty = useTransform(
    p,
    [0.28, 0.38],
    [`0vh`, `${f.targetY - f.scatterY}vh`],
  );
  // fade in → zoom in (read) → hold → settle as it groups
  const scale = useTransform(
    p,
    [0.14, 0.18, 0.24, 0.3, 0.38],
    [
      f.depth * 0.7,
      f.depth,
      f.depth * 1.14,
      f.depth * 1.14,
      f.depth * 0.9,
    ],
  );
  const vFull = f.depth * 0.55 + 0.25;
  const vDim = vFull * 0.3;
  const opacity = useTransform(
    p,
    [0.14, 0.18, 0.34, 0.38, 0.44, 0.5],
    [0, vFull, vFull, vDim, vDim, 0],
  );
  const px = useTransform(
    mx,
    [-0.5, 0.5],
    [-30 * f.depth, 30 * f.depth],
  );
  const py = useTransform(
    my,
    [-0.5, 0.5],
    [-20 * f.depth, 20 * f.depth],
  );

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${f.scatterX}%`, top: `${f.scatterY}%` }}
    >
      <motion.div style={{ x: px, y: py }}>
        <motion.div style={{ x: tx, y: ty, opacity, scale }}>
          <motion.div
            animate={{ y: [0, -f.float, 0] }}
            transition={{
              duration: 5 + f.float,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ rotate: f.rot }}
            className="whitespace-nowrap rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-white/75"
          >
            <span
              className="text-[13px]"
              style={{
                fontFamily: "Plus Jakarta Sans, sans-serif",
              }}
            >
              {f.text}
            </span>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Holographic-glass label chip (like the confidence cards)
function HoloLabel({ text }: { text: string }) {
  return (
    <span
      className="relative inline-block overflow-hidden rounded-full border border-white/25 px-3.5 py-1.5"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.18), rgba(124,58,237,0.12) 50%, rgba(255,255,255,0.05))",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.45), 0 8px 24px -10px rgba(0,0,0,0.6)",
      }}
    >
      <motion.span
        className="pointer-events-none absolute inset-0"
        animate={{ backgroundPositionX: ["0%", "200%"] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          background:
            "linear-gradient(110deg, transparent 35%, rgba(255,255,255,0.3) 50%, rgba(124,58,237,0.25) 54%, transparent 68%)",
          backgroundSize: "200% 100%",
          mixBlendMode: "overlay",
        }}
      />
      <span
        className="relative whitespace-nowrap text-white"
        style={{
          fontFamily: "Fraunces, serif",
          fontWeight: 600,
          fontStyle: "italic",
          fontSize: "clamp(1.05rem,1.6vw,1.4rem)",
        }}
      >
        {text}
      </span>
    </span>
  );
}

function Constellation({
  p,
  mx,
  my,
}: {
  p: MotionValue<number>;
  mx: MotionValue<number>;
  my: MotionValue<number>;
}) {
  const [hover, setHover] = useState<ClusterId | null>(null);
  const headerO = useTransform(
    p,
    [0.28, 0.32, 0.5, 0.55],
    [0, 1, 1, 0],
  );
  const opacity = useTransform(
    p,
    [0.38, 0.44, 0.52, 0.58],
    [0, 1, 1, 0],
  );
  const scale = useTransform(p, [0.54, 0.6], [1, 0.04]);
  const lineDraw = useTransform(p, [0.44, 0.52], [1, 0]);
  const px = useTransform(mx, [-0.5, 0.5], [-14, 14]);
  const py = useTransform(my, [-0.5, 0.5], [-10, 10]);

  return (
    <>
      {/* mind-map header */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-[24%] z-10 text-center"
        style={{ opacity: headerO }}
      >
        <p
          className="uppercase tracking-[0.24em] text-white/40 mx-[0px] mt-[-94px] mb-[8px] text-[14px]"
          style={{
            fontFamily: "Plus Jakarta Sans, sans-serif",
            fontWeight: 600,
          }}
        >
          The mind map
        </p>
        <h3
          className="text-[clamp(1.6rem,3.6vw,2.8rem)] leading-tight text-white px-[24px] pt-[12px] pb-[52px]"
          style={{
            fontFamily: "Fraunces, serif",
            fontWeight: 400,
          }}
        >
          The signals begin to{" "}
          <span style={{ fontStyle: "italic", color: ACCENT }}>
            connect.
          </span>
        </h3>
      </motion.div>

      <motion.div
        className="absolute inset-0"
        style={{
          opacity,
          scale,
          x: px,
          y: py,
          transformOrigin: "50% 50%",
        }}
      >
        {/* monochrome, static connection lines (no vibration, no colour) */}
        <svg
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
        >
          {connections.map(([a, b], i) => {
            const A = clusterById(a);
            const B = clusterById(b);
            return (
              <motion.line
                key={i}
                x1={`${A.x}%`}
                y1={`${A.y}%`}
                x2={`${B.x}%`}
                y2={`${B.y}%`}
                stroke="rgba(255,255,255,0.28)"
                strokeWidth={1}
                pathLength={1}
                strokeDasharray={1}
                style={{ strokeDashoffset: lineDraw }}
              />
            );
          })}
        </svg>
        {clusters.map((c, idx) => {
          // flip label to the left for right-edge nodes so it doesn't overflow
          const flipLeft = c.x > 62;
          return (
            <div
              key={c.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${c.x}%`, top: `${c.y}%` }}
              onMouseEnter={() => setHover(c.id)}
              onMouseLeave={() => setHover(null)}
            >
              {/* outer pulsing ring */}
              <motion.div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                animate={{
                  scale: [1, 1.9, 1],
                  opacity: [0.35, 0, 0.35],
                }}
                transition={{
                  duration: 2.6 + idx * 0.25,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  width: 20,
                  height: 20,
                  border: "1px solid rgba(255,255,255,0.5)",
                }}
              />
              {/* inner dot */}
              <div
                className="relative h-3 w-3 rounded-full bg-white"
                style={{
                  boxShadow:
                    "0 0 12px 3px rgba(255,255,255,0.5)",
                }}
              />
              {/* label — flips side to avoid overflow */}
              <div
                className={`absolute top-1/2 -translate-y-1/2 ${flipLeft ? "right-6" : "left-6"}`}
              >
                <HoloLabel text={c.label} />
              </div>
              {hover === c.id && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`absolute top-9 z-20 w-52 rounded-xl border border-white/15 bg-black/75 p-3 backdrop-blur-md ${flipLeft ? "right-0" : "left-0"}`}
                >
                  <p
                    className="text-[11px] uppercase tracking-[0.14em] text-white/70"
                    style={{
                      fontFamily:
                        "Plus Jakarta Sans, sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    {c.label}
                  </p>
                  <p
                    className="mt-1 text-[12px] leading-relaxed text-white/60"
                    style={{
                      fontFamily:
                        "Plus Jakarta Sans, sans-serif",
                    }}
                  >
                    {c.snippet}
                  </p>
                </motion.div>
              )}
            </div>
          );
        })}
      </motion.div>
    </>
  );
}

function clusterById(id: ClusterId) {
  return clusters.find((c) => c.id === id)!;
}

function Eureka({ p }: { p: MotionValue<number> }) {
  const flash = useTransform(p, [0.58, 0.62, 0.68], [0, 1, 0]);
  const flashScale = useTransform(p, [0.58, 0.68], [0.2, 2.4]);
  const line1 = useTransform(
    p,
    [0.62, 0.65, 0.7, 0.72],
    [0, 1, 1, 0],
  );
  const line2 = useTransform(
    p,
    [0.635, 0.665, 0.7, 0.72],
    [0, 1, 1, 0],
  );
  const y1 = useTransform(p, [0.62, 0.66], [24, 0]);
  const y2 = useTransform(p, [0.635, 0.675], [24, 0]);

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <motion.div
        className="absolute h-[40vh] w-[40vh] rounded-full"
        style={{
          opacity: flash,
          scale: flashScale,
          background: `radial-gradient(circle, ${ACCENT} 0%, ${ACCENT}55 35%, transparent 70%)`,
        }}
      />
      <div className="relative px-6 text-center">
        <motion.p
          style={{
            opacity: line1,
            y: y1,
            fontFamily: "Plus Jakarta Sans, sans-serif",
            fontWeight: 600,
          }}
          className="mb-4 uppercase tracking-[0.26em] text-white/40 text-[18px]"
        >
          Hypothesis
        </motion.p>
        <motion.h2
          style={{ opacity: line1, y: y1 }}
          className="text-[clamp(2rem,6vw,5rem)] leading-[1.05] tracking-[-0.03em] text-white"
        >
          <span
            style={{
              fontFamily: "Fraunces, serif",
              fontWeight: 400,
            }}
          >
            People aren't abandoning the flow.
          </span>
        </motion.h2>
        <motion.h2
          style={{ opacity: line2, y: y2 }}
          className="mt-4 text-[clamp(2.4rem,7vw,6rem)] leading-[1.02] tracking-[-0.03em]"
        >
          <span
            style={{
              fontFamily: "Fraunces, serif",
              fontWeight: 500,
              fontStyle: "italic",
              color: ACCENT,
            }}
          >
            They're hesitating.
          </span>
        </motion.h2>
      </div>
    </div>
  );
}

/* ---------- Scene: solution as holographic metal cards ---------- */

const solutionCards = [
  {
    Icon: Bell,
    title: "Your cart is saved",
    value: "$128.40 waiting for you",
    tint: "#A78BFA",
  },
  {
    Icon: ShieldCheck,
    title: "Secure checkout",
    value: "256-bit encrypted · protected",
    tint: "#22D3EE",
  },
  {
    Icon: BadgeCheck,
    title: "12,480 verified buyers",
    value: "4.9 ★ · trusted by thousands",
    tint: "#34D399",
  },
  {
    Icon: Truck,
    title: "Free 30-day returns",
    value: "No questions asked",
    tint: "#F472B6",
  },
  {
    Icon: Headphones,
    title: "Help in seconds",
    value: "Live chat · 24/7 support",
    tint: "#FBBF24",
  },
];

function HoloCard({
  c,
  i,
  p,
}: {
  c: (typeof solutionCards)[number];
  i: number;
  p: MotionValue<number>;
}) {
  const start = 0.725 + i * 0.01;
  const y = useTransform(p, [start, start + 0.05], [50, 0]);
  const rot =
    i === 0 ? -6 : i === 2 ? 6 : i === 3 ? -4 : i === 4 ? 4 : 0;
  const { Icon } = c;

  return (
    <motion.div style={{ y, rotate: rot }} className="relative">
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{
          duration: 6 + i,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div
          className="relative w-64 overflow-hidden rounded-2xl border border-white/20 p-4"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.20), rgba(124,58,237,0.10) 38%, rgba(255,255,255,0.05) 60%, rgba(34,211,238,0.12))",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            boxShadow: `0 24px 70px -22px ${c.tint}99, inset 0 1px 0 rgba(255,255,255,0.5), inset 0 0 24px rgba(255,255,255,0.06)`,
          }}
        >
          <motion.div
            className="pointer-events-none absolute inset-0"
            animate={{ backgroundPositionX: ["0%", "200%"] }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              background:
                "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.28) 48%, rgba(124,58,237,0.25) 52%, transparent 70%)",
              backgroundSize: "200% 100%",
              mixBlendMode: "overlay",
            }}
          />
          <div className="relative flex items-start gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{
                background: `${c.tint}26`,
                border: `1px solid ${c.tint}66`,
              }}
            >
              <Icon size={18} style={{ color: c.tint }} />
            </div>
            <div className="min-w-0">
              <p
                className="text-[14px] text-white"
                style={{
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                  fontWeight: 600,
                }}
              >
                {c.title}
              </p>
              <p
                className="mt-0.5 text-[12px] text-white/65"
                style={{
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                }}
              >
                {c.value}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Solution({ p }: { p: MotionValue<number> }) {
  const opacity = useTransform(
    p,
    [0.71, 0.75, 0.81, 0.84],
    [0, 1, 1, 0],
  );
  const labelOpacity = useTransform(p, [0.72, 0.76], [0, 1]);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{ opacity }}
    >
      <motion.p
        style={{ opacity: labelOpacity }}
        className="mb-8 text-[clamp(1.4rem,3vw,2.2rem)] text-white"
      >
        <span style={{ fontFamily: "Fraunces, serif" }}>
          So we rebuilt their{" "}
        </span>
        <span
          style={{
            fontFamily: "Fraunces, serif",
            fontStyle: "italic",
            color: ACCENT,
          }}
        >
          confidence.
        </span>
      </motion.p>
      <div className="mx-auto flex max-w-[820px] flex-wrap items-center justify-center gap-5 px-6">
        {solutionCards.map((c, i) => (
          <HoloCard key={c.title} c={c} i={i} p={p} />
        ))}
      </div>
    </motion.div>
  );
}

/* ---------- Scene: outcome + impact (single flex-column layout) ---------- */

const METRICS = [
  { v: "+24%", l: "Conversion" },
  { v: "−38%", l: "Friction" },
  { v: "+19", l: "NPS" },
  { v: "2.3M", l: "Active Users" },
];

function OutcomeScene({ p }: { p: MotionValue<number> }) {
  // whole scene fades in once
  const sceneOpacity = useTransform(p, [0.83, 0.845], [0, 1]);

  // heading: first thing to appear
  const headingOpacity = useTransform(p, [0.83, 0.846], [0, 1]);
  const headingY = useTransform(p, [0.83, 0.846], [20, 0]);

  // video: appears on next scroll beat, no scale/resize
  const videoOpacity = useTransform(p, [0.854, 0.872], [0, 1]);
  const videoY = useTransform(p, [0.854, 0.872], [22, 0]);

  // metrics: appear after video settles
  const metricsOpacity = useTransform(
    p,
    [0.871, 0.892],
    [0, 1],
  );
  const metricsY = useTransform(p, [0.871, 0.892], [16, 0]);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center overflow-hidden"
      style={{ opacity: sceneOpacity, paddingTop: "13%" }}
    >
      {/* heading */}
      <motion.div
        className="w-full text-center pointer-events-none px-6 mb-6"
        style={{ opacity: headingOpacity, y: headingY }}
      >
        <p
          className="mb-2 uppercase tracking-[0.24em] text-white/40 text-[16px]"
          style={{
            fontFamily: "Plus Jakarta Sans, sans-serif",
            fontWeight: 600,
          }}
        >
          The outcome
        </p>
        <h3
          className="text-[clamp(1.4rem,2.8vw,2.2rem)] leading-tight text-white"
          style={{
            fontFamily: "Fraunces, serif",
            fontWeight: 400,
          }}
        >
          A flow that finally{" "}
          <span style={{ fontStyle: "italic", color: ACCENT }}>
            reassures.
          </span>
        </h3>
      </motion.div>

      {/* video — fixed size, no scale transform */}
      <motion.div
        className="relative w-[min(360px,76vw)] flex-shrink-0 mb-8"
        style={{ opacity: videoOpacity, y: videoY }}
      >
        <div
          className="absolute -inset-6 rounded-3xl blur-2xl p-[0px]"
          style={{
            background: `radial-gradient(circle, ${ACCENT}2a, transparent 70%)`,
          }}
        />
        <div
          className="relative overflow-hidden rounded-xl border border-white/15"
          style={{ boxShadow: `0 24px 70px -20px ${ACCENT}77` }}
        >
          <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/[0.06] px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-white/25" />
            <span className="h-2 w-2 rounded-full bg-white/25" />
            <span className="h-2 w-2 rounded-full bg-white/25" />
            <span
              className="ml-2 text-[10px] text-white/35"
              style={{
                fontFamily: "Plus Jakarta Sans, sans-serif",
              }}
            >
              the outcome
            </span>
          </div>
          <video
            src={designVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="block aspect-video w-full object-cover"
          />
        </div>
      </motion.div>

      {/* metrics */}
      <motion.div
        className="w-full max-w-[840px] px-8"
        style={{ opacity: metricsOpacity, y: metricsY }}
      >
        <div className="grid grid-cols-2 gap-y-6 md:grid-cols-4">
          {METRICS.map((m, i) => (
            <motion.div
              key={m.l}
              className="text-center"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <p
                className="text-[clamp(2rem,3.8vw,3.2rem)] leading-none tracking-[-0.03em] text-white"
                style={{
                  fontFamily: "Fraunces, serif",
                  fontWeight: 300,
                }}
              >
                {m.v}
              </p>
              <p
                className="mt-1.5 text-[11px] uppercase tracking-[0.16em] text-white/45"
                style={{
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                  fontWeight: 600,
                }}
              >
                {m.l}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ---------- Intro: scroll prompt → problem → noise ---------- */

function Intro({ p }: { p: MotionValue<number> }) {
  const promptO = useTransform(p, [0, 0.018, 0.032], [1, 1, 0]);
  const problemO = useTransform(
    p,
    [0.034, 0.055, 0.09, 0.12],
    [0, 1, 1, 0],
  );
  const problemY = useTransform(p, [0.034, 0.065], [24, 0]);
  const noiseO = useTransform(
    p,
    [0.13, 0.16, 0.24, 0.3],
    [0, 1, 1, 0],
  );

  return (
    <>
      {/* 1 — scroll to enter */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center text-center"
        style={{ opacity: promptO }}
      >
        <p
          className="mb-4 uppercase tracking-[0.34em] text-white/40 text-[15px] text-[#ffffffbd]"
          style={{
            fontFamily: "Plus Jakarta Sans, sans-serif",
            fontWeight: 600,
          }}
        >
          Inside MY Design Mind
        </p>
        <p
          className="mb-8 text-[clamp(2.8rem,2.2vw,1.6rem)] text-white/70 text-[48px]"
          style={{
            fontFamily: "Fraunces, serif",
            fontStyle: "italic",
          }}
        >
          An architecture of thought.
        </p>
        <div className="flex flex-col items-center gap-1 text-white/50">
          <span
            className="text-[12px] uppercase tracking-[0.24em] text-[#ffffffa3]"
            style={{
              fontFamily: "Plus Jakarta Sans, sans-serif",
              fontWeight: 600,
            }}
          >
            Scroll to enter
          </span>
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <ChevronDown size={20} />
          </motion.span>
        </div>
      </motion.div>

      {/* 2 — the problem (with sample-use-case tag) */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-[26%] z-10 flex flex-col items-center text-center"
        style={{ opacity: problemO, y: problemY }}
      >
        <span
          className="mb-5 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5"
          style={{
            borderColor: `${ACCENT}66`,
            background: `${ACCENT}1a`,
          }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: ACCENT }}
          />
          <span
            className="text-[11px] uppercase tracking-[0.2em]"
            style={{
              color: "#C4B5FD",
              fontFamily: "Plus Jakarta Sans, sans-serif",
              fontWeight: 600,
            }}
          >
            Sample use case · E-commerce
          </span>
        </span>
        <p
          className="mb-3 text-[13px] uppercase tracking-[0.2em] text-white/50"
          style={{
            fontFamily: "Plus Jakarta Sans, sans-serif",
            fontWeight: 500,
          }}
        >
          It began with one problem
        </p>
        <h2 className="px-6 text-[clamp(2.4rem,6vw,5rem)] leading-[1.04] tracking-[-0.03em] text-white">
          <span
            style={{
              fontFamily: "Fraunces, serif",
              fontWeight: 400,
            }}
          >
            Ex: Abandoned{" "}
          </span>
          <span
            style={{
              fontFamily: "Fraunces, serif",
              fontStyle: "italic",
              color: ACCENT,
            }}
          >
            checkout.
          </span>
        </h2>
      </motion.div>

      {/* 3 — the noise (header appears before the fragments) */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-[20%] z-10 text-center p-[0px] mx-[0px] my-[-69px]"
        style={{ opacity: noiseO }}
      >
        <p
          className="mb-2 text-[11px] uppercase tracking-[0.24em] text-white/40"
          style={{
            fontFamily: "Plus Jakarta Sans, sans-serif",
            fontWeight: 600,
          }}
        >
          The noise
        </p>
        <h3
          className="px-6 text-[clamp(1.6rem,3.6vw,2.8rem)] leading-tight text-white"
          style={{
            fontFamily: "Fraunces, serif",
            fontWeight: 400,
          }}
        >
          Behind it —{" "}
          <span style={{ fontStyle: "italic", color: ACCENT }}>
            hundreds
          </span>{" "}
          of disconnected signals.
        </h3>
      </motion.div>
    </>
  );
}

export function InsideTheDesignMind() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 26,
    mass: 0.4,
  });

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 80, damping: 20 });
  const smy = useSpring(my, { stiffness: 80, damping: 20 });
  const lightX = useMotionValue(-200);
  const lightY = useMotionValue(-200);

  const onMove = (e: React.MouseEvent) => {
    const r = stickyRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
    lightX.set(e.clientX - r.left);
    lightY.set(e.clientY - r.top);
  };

  return (
    <section
      ref={sectionRef}
      className="relative border-t border-border"
      style={{ height: "950vh", background: "#0A0A0F" }}
    >
      <div
        ref={stickyRef}
        onMouseMove={onMove}
        className="sticky top-16 h-[calc(100vh-4rem)] w-full overflow-hidden"
        style={{ background: "#0A0A0F" }}
      >
        {/* Design-Process backdrop: ambient grid + indigo / pink orbs */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.05,
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div
          className="absolute top-1/3 left-1/4 h-[500px] w-[500px] rounded-full blur-[120px] pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full blur-[100px] pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)",
          }}
        />

        {/* cursor discovery light */}
        <motion.div
          className="pointer-events-none absolute h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            left: lightX,
            top: lightY,
            background: `radial-gradient(circle, ${ACCENT}1f, transparent 65%)`,
            mixBlendMode: "screen",
          }}
        />

        <Intro p={p} />

        <div className="absolute inset-0">
          {fragments.map((f) => (
            <Fragment
              key={f.id}
              f={f}
              p={p}
              mx={smx}
              my={smy}
            />
          ))}
        </div>

        <Constellation p={p} mx={smx} my={smy} />
        <Eureka p={p} />
        <Solution p={p} />
        <OutcomeScene p={p} />
      </div>
    </section>
  );
}