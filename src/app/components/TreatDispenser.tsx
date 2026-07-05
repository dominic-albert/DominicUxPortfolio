import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";

/* ============================================================
   The Treat Dispenser — joke machine.
   Lever rotates around a top pivot → ticket drops into window.
   ============================================================ */

interface Joke {
  setup: string;
  punchline: string;
}

const jokes: Joke[] = [
  { setup: "I asked AI to redesign my app.", punchline: "It replaced every button with a chatbot." },
  { setup: "Good UX is invisible.", punchline: "So apparently, my work doesn't exist." },
  { setup: "The stakeholder wanted AI everywhere.", punchline: "Even the logout button now gives advice." },
  { setup: "I use AI every day.", punchline: "Mostly to spell \"necessary\" correctly." },
  { setup: "I became a UX designer to solve problems.", punchline: "Turns out, most problems are meetings." },
  { setup: "My Figma file is organized.", punchline: "Said no one ever." },
  { setup: "Why did the button break up with the form?", punchline: "It felt too attached." },
  { setup: "Designers don't get lost.", punchline: "They just follow different user journeys." },
  { setup: "I asked AI to summarize a meeting.", punchline: "It summarized my will to live." },
  { setup: "My prototype worked perfectly.", punchline: "Which is how I knew it wasn't production." },
  { setup: "I hid the bugs in dark mode.", punchline: "QA turned on light mode." },
  { setup: "I told AI to make my portfolio unique.", punchline: "It gave me glassmorphism and a particle background." },
  { setup: "I optimized the loading screen.", punchline: "Now users can wait faster." },
  { setup: "I love dark mode.", punchline: "Mostly because bugs are harder to see." },
  { setup: "I bought a standing desk.", punchline: "Now I can procrastinate vertically." },
  { setup: "The best thing about AI?", punchline: "It makes mistakes confidently, just like humans." },
  { setup: "AI is replacing repetitive tasks.", punchline: "Unfortunately, paying bills isn't one of them." },
  { setup: "The client asked for a minimalist design.", punchline: "Then sent a list of 47 requirements." },
];

const PHASE_THINK_MS = 1400;

/* ── Decorative screw ── */
function Screw({ className }: { className: string }) {
  return (
    <div
      className={`absolute h-2 w-2 rounded-full ${className}`}
      style={{ background: "radial-gradient(circle at 35% 30%, #50505c, #131318)", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.5), 0 1px 1px rgba(255,255,255,0.06)" }}
    >
      <div className="absolute left-1/2 top-1/2 h-px w-1.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-black/70" />
    </div>
  );
}

/* ── Bold fold-over ticket ── */
function GoldTicket({ joke }: { joke: Joke }) {
  const FOLD = 32;
  const FONT = "Fraunces, serif";

  return (
    <div className="relative mx-auto select-none" style={{ width: 214 }}>
      {/* Ticket body */}
      <div
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #FEF9E4 0%, #F6E99A 55%, #EDD666 100%)",
          borderRadius: 10,
          boxShadow: "0 10px 36px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.65)",
        }}
      >
        {/* Paper grain */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

        {/* Single line — one style, setup flows into punchline */}
        <div className="px-5 py-5 text-center">
          <p style={{
            fontFamily: FONT,
            fontSize: 13.5,
            fontWeight: 500,
            fontStyle: "italic",
            color: "#1E1200",
            lineHeight: 1.5,
          }}>
            {joke.setup} {joke.punchline} 😄
          </p>
        </div>

        {/* Fold-over corner bottom-right */}
        <div className="absolute bottom-0 right-0 pointer-events-none" style={{ width: FOLD, height: FOLD }}>
          <div className="absolute inset-0" style={{ background: `linear-gradient(225deg, transparent ${FOLD * 0.5}px, rgba(0,0,0,0.15) ${FOLD * 0.5}px)` }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(225deg, #C9A832 ${FOLD * 0.5}px, transparent ${FOLD * 0.5}px)`, boxShadow: "-2px -2px 6px rgba(0,0,0,0.22)" }} />
          <div className="absolute" style={{ width: 1, height: FOLD * 1.41, background: "rgba(255,255,255,0.3)", transformOrigin: "top left", transform: "rotate(45deg)", top: 0, right: FOLD - 1 }} />
        </div>
      </div>

      {/* Ground shadow */}
      <div className="absolute -bottom-2 left-6 right-6 h-3 rounded-full pointer-events-none"
        style={{ background: "rgba(0,0,0,0.4)", filter: "blur(7px)", transform: "translateY(4px)" }} />
    </div>
  );
}

/* ── Idle window prompt ── */
function IdlePrompt() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-6">
      <motion.p
        animate={{ opacity: [0.45, 0.85, 0.45] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ fontFamily: "Fraunces, serif", fontStyle: "italic", fontSize: 16, color: "rgba(255,255,255,0.7)", lineHeight: 1.4 }}
      >
        Pull the lever —<br />get a joke.
      </motion.p>
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        style={{ color: "rgba(255,255,255,0.3)", fontSize: 18 }}
      >
        ↓
      </motion.div>
    </div>
  );
}

/* ── Right-side pull-down lever ── */
function Lever({ onPull, disabled }: { onPull: () => void; disabled: boolean }) {
  const TRACK_H = 100;
  const KNOB_D  = 28;

  return (
    /* Mounted on the right side, vertical slot, knob at top → pull down */
    <div className="absolute z-20 flex flex-col items-center" style={{ right: -22, top: 80, width: 28 }}>
      {/* Mount bracket at top */}
      <div style={{
        width: 28, height: 14,
        borderRadius: "6px 6px 3px 3px",
        background: "linear-gradient(180deg, #38383f 0%, #1e1e26 100%)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.12)",
        flexShrink: 0,
      }} />

      {/* Fixed slot track */}
      <div style={{
        width: 8, height: TRACK_H,
        background: "#06060c",
        borderRadius: "0 0 4px 4px",
        boxShadow: "inset 0 2px 5px rgba(0,0,0,0.95), 0 0 0 1px rgba(255,255,255,0.04)",
        flexShrink: 0,
      }} />

      {/* Draggable unit: knob + stick below it */}
      <motion.div
        drag={disabled ? false : "y"}
        dragConstraints={{ top: 0, bottom: TRACK_H - KNOB_D }}
        dragElastic={0.05}
        dragSnapToOrigin
        onDragEnd={(_, info) => { if (info.offset.y > 22 && !disabled) onPull(); }}
        whileHover={disabled ? {} : { scale: 1.06 }}
        whileDrag={{ cursor: "grabbing" }}
        role="button"
        tabIndex={0}
        aria-label="Pull the lever"
        onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && !disabled) { e.preventDefault(); onPull(); } }}
        style={{
          position: "absolute",
          top: 8,
          left: "50%",
          x: "-50%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          cursor: disabled ? "not-allowed" : "grab",
          touchAction: "none",
          zIndex: 10,
          outline: "none",
        }}
      >
        {/* Knob ball */}
        <div style={{
          width: KNOB_D,
          height: KNOB_D,
          borderRadius: "50%",
          flexShrink: 0,
          background: disabled
            ? "radial-gradient(circle at 38% 32%, #555, #222)"
            : "radial-gradient(circle at 36% 30%, #ddd6fe, #7C3AED 68%)",
          boxShadow: disabled
            ? "0 3px 10px rgba(0,0,0,0.6)"
            : "0 0 14px 4px rgba(124,58,237,0.6), 0 4px 12px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.5)",
        }} />
        {/* Stick connecting knob to slot */}
        <div style={{
          width: 5,
          height: 36,
          borderRadius: 3,
          flexShrink: 0,
          background: "linear-gradient(180deg, #4a4a54 0%, #25252e 100%)",
          boxShadow: "1px 0 0 rgba(255,255,255,0.07), -1px 0 0 rgba(0,0,0,0.5)",
        }} />
      </motion.div>

      {/* "Pull lever" hint label */}
      <p style={{
        position: "absolute",
        top: TRACK_H + 22,
        left: "50%",
        transform: "translateX(-50%) rotate(90deg)",
        transformOrigin: "center center",
        whiteSpace: "nowrap",
        fontSize: 7,
        fontWeight: 700,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.22)",
        fontFamily: "Plus Jakarta Sans, sans-serif",
        pointerEvents: "none",
      }}>
        Pull lever
      </p>
    </div>
  );
}

export function TreatDispenser() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [phase, setPhase] = useState<"idle" | "thinking" | "revealed">("idle");
  const [joke, setJoke] = useState<Joke | null>(null);
  const [count, setCount] = useState(0);
  const audioRef = useRef<AudioContext | null>(null);

  const audioCtx = () => {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return null;
    if (!audioRef.current) audioRef.current = new Ctx();
    if (audioRef.current.state === "suspended") audioRef.current.resume();
    return audioRef.current;
  };

  const playClunk = () => {
    const ctx = audioCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const thud = ctx.createOscillator();
    const g = ctx.createGain();
    thud.type = "sine";
    thud.frequency.setValueAtTime(150, t);
    thud.frequency.exponentialRampToValueAtTime(58, t + 0.13);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.22, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
    thud.connect(g).connect(ctx.destination);
    thud.start(t); thud.stop(t + 0.22);
  };

  const playChime = () => {
    const ctx = audioCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    [880, 1320].forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = f;
      const start = t + i * 0.08;
      g.gain.setValueAtTime(0.0001, start);
      g.gain.exponentialRampToValueAtTime(0.08, start + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, start + 0.5);
      o.connect(g).connect(ctx.destination);
      o.start(start); o.stop(start + 0.55);
    });
  };

  const pull = () => {
    if (phase === "thinking") return;
    playClunk();
    setJoke(null);
    setPhase("thinking");
    window.setTimeout(() => {
      setJoke(jokes[Math.floor(Math.random() * jokes.length)]);
      setPhase("revealed");
      setCount((c) => c + 1);
      playChime();
    }, PHASE_THINK_MS);
  };

  const thinking = phase === "thinking";

  return (
    <section className="relative overflow-hidden border-t border-border py-24 md:py-32" style={{ background: "#0A0A0F" }}>
      {/* backgrounds */}
      <div className="pointer-events-none absolute inset-0" style={{ opacity: 0.04, backgroundImage: "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)", backgroundSize: "60px 60px", maskImage: "radial-gradient(circle at 50% 45%, black, transparent 75%)", WebkitMaskImage: "radial-gradient(circle at 50% 45%, black, transparent 75%)" }} />
      <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "radial-gradient(60% 50% at 50% 38%, rgba(124,58,237,0.10), transparent 70%)" }} />
      <div className="pointer-events-none absolute inset-0" style={{ boxShadow: "inset 0 0 220px 50px rgba(0,0,0,0.85)" }} />

      <div ref={ref} className="relative mx-auto max-w-[640px] px-6 text-center">
        {/* heading */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="mb-4 text-[11px] uppercase tracking-[0.3em] text-white/40"
          style={{ fontFamily: "Fraunces, serif", fontStyle: "italic" }}
        >
          A small treat before you go
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.06] tracking-[-0.03em] text-white"
          style={{ fontFamily: "Fraunces, serif", fontWeight: 400 }}
        >Leave with a <span style={{ fontStyle: "italic", color: "#C4B5FD" }}>smile.</span></motion.h2>

        {/* ── The Machine ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto"
          style={{ width: 310, height: 400 }}
        >
          {/* Floor glow */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 rounded-[50%]" style={{ width: 280, height: 40, background: "radial-gradient(circle, rgba(124,58,237,0.45), transparent 70%)", filter: "blur(10px)" }} />

          {/* ── Machine body — bright metallic vending machine ── */}
          <div
            className="absolute inset-0 rounded-[32px]"
            style={{
              background: "linear-gradient(170deg, #3a3a4a 0%, #2c2c3a 30%, #222230 60%, #1a1a26 100%)",
              boxShadow: "inset 2px 0 0 rgba(255,255,255,0.18), inset -2px 0 0 rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.2), 0 0 0 1px rgba(255,255,255,0.12), 0 30px 80px -20px rgba(0,0,0,0.9), 0 0 60px -10px rgba(124,58,237,0.25)",
            }}
          >
            {/* Brushed vertical grain */}
            <div className="absolute inset-0 rounded-[32px]" style={{ backgroundImage: "repeating-linear-gradient(180deg, rgba(255,255,255,0.025) 0 1px, transparent 1px 4px)", opacity: 0.6, mixBlendMode: "overlay" }} />

            {/* Left shine edge */}
            <div className="absolute top-6 bottom-6 left-0 w-8 rounded-l-[32px]" style={{ background: "linear-gradient(to right, rgba(255,255,255,0.14), transparent)" }} />
            {/* Right shadow edge */}
            <div className="absolute top-6 bottom-6 right-0 w-8 rounded-r-[32px]" style={{ background: "linear-gradient(to left, rgba(0,0,0,0.55), transparent)" }} />

            <Screw className="left-3 top-3" />
            <Screw className="right-3 top-3" />
            <Screw className="left-3 bottom-3" />
            <Screw className="right-3 bottom-3" />

            {/* ── Neon header band ── */}
            <div className="absolute left-5 right-5 top-4 rounded-xl overflow-hidden" style={{ height: 28 }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, #1a0a3a, #2d1060, #1a0a3a)" }} />
              <motion.div
                style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, transparent 0%, rgba(167,139,250,0.35) 50%, transparent 100%)" }}
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
              />
              <p className="absolute inset-0 flex items-center justify-center text-[8px] font-black tracking-[0.4em] uppercase" style={{ color: "#c4b5fd", fontFamily: "Plus Jakarta Sans, sans-serif", textShadow: "0 0 8px rgba(167,139,250,0.9)" }}>
                ✦ Joke-O-Matic ✦
              </p>
            </div>

            {/* ── Glass viewing window ── */}
            <div
              className="absolute left-5 right-5 rounded-2xl"
              style={{ top: 42, height: 218, padding: 5, background: "linear-gradient(160deg, #444455, #1e1e2a)", boxShadow: "0 4px 12px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.15)" }}
            >
              <div
                className="relative h-full w-full overflow-hidden rounded-xl"
                style={{ background: "linear-gradient(180deg, #0d0b16 0%, #130e1e 100%)", border: "1px solid rgba(167,139,250,0.15)", boxShadow: "inset 0 0 40px rgba(0,0,0,0.8)" }}
              >
                {/* Ambient glow */}
                <motion.div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  animate={{
                    opacity: thinking ? [0.6, 1, 0.6] : phase === "revealed" ? 0.06 : [0.15, 0.3, 0.15],
                    scale: thinking ? [1, 1.18, 1] : [1, 1.06, 1],
                  }}
                  transition={{ duration: thinking ? 0.65 : 4, repeat: Infinity, ease: "easeInOut" }}
                  style={{ width: 180, height: 180, background: "radial-gradient(circle, rgba(124,58,237,0.6), transparent 70%)" }}
                />
                {/* Glass glare */}
                <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(130deg, rgba(255,255,255,0.1), transparent 40%)", zIndex: 10 }} />

                <AnimatePresence>
                  {phase === "idle" && <IdlePrompt key="idle" />}
                </AnimatePresence>
                <AnimatePresence>
                  {thinking && (
                    <motion.div key="thinking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center gap-2">
                      {[0, 1, 2].map((i) => (
                        <motion.span key={i} className="h-2.5 w-2.5 rounded-full" style={{ background: "#a78bfa" }}
                          animate={{ scale: [1, 1.6, 1], opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 0.75, repeat: Infinity, delay: i * 0.14 }} />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {phase === "revealed" && joke && (
                    <motion.div key={count} initial={{ y: -260, opacity: 0, rotate: -4 }} animate={{ y: 0, opacity: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 90, damping: 16 }}
                      className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 5, padding: "10px" }}>
                      <GoldTicket joke={joke} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Screw className="left-1 top-1" />
              <Screw className="right-1 top-1" />
              <Screw className="left-1 bottom-1" />
              <Screw className="right-1 bottom-1" />
            </div>

            {/* ── Control panel ── */}
            <div className="absolute left-5 right-5 rounded-xl px-3 py-2.5"
              style={{ top: 268, height: 52, background: "linear-gradient(160deg,#28283a,#18182a)", border: "1px solid rgba(167,139,250,0.12)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <motion.span className="h-2 w-2 rounded-full" style={{ background: "#34d399", boxShadow: "0 0 6px rgba(52,211,153,0.8)" }}
                    animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />
                  <span className="text-[8px] uppercase tracking-[0.2em]" style={{ color: "rgba(167,139,250,0.6)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 700 }}>Ready</span>
                </div>
                {/* LED dots */}
                <div className="flex gap-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <motion.span key={i} className="h-2 w-2 rounded-full"
                      style={{ background: "#7C3AED" }}
                      animate={thinking ? { opacity: [0.15, 1, 0.15], boxShadow: ["0 0 0px #7C3AED", "0 0 8px #7C3AED", "0 0 0px #7C3AED"] } : { opacity: 0.2 }}
                      transition={thinking ? { duration: 0.55, repeat: Infinity, delay: i * 0.1 } : {}} />
                  ))}
                </div>
              </div>
              {/* Speaker grille */}
              <div className="mt-2 flex justify-center gap-[4px]">
                {Array.from({ length: 11 }).map((_, i) => (
                  <div key={i} className="h-1.5 w-[2px] rounded-full" style={{ background: "rgba(255,255,255,0.12)" }} />
                ))}
              </div>
            </div>

            {/* ── Brand label strip ── */}
            <div className="absolute left-5 right-5 flex items-center justify-center"
              style={{ top: 326, height: 18, background: "rgba(167,139,250,0.08)", borderRadius: 6, border: "1px solid rgba(167,139,250,0.1)" }}>
              <p className="text-[7px] uppercase tracking-[0.38em]" style={{ color: "rgba(167,139,250,0.45)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 700 }}>
                Joke-O-Matic™ · Series 1
              </p>
            </div>

            {/* ── Dispenser slot ── */}
            <div className="absolute left-10 right-10 h-2 rounded-full" style={{ top: 350, background: "#08080f", boxShadow: "inset 0 2px 5px rgba(0,0,0,0.95), 0 0 0 1px rgba(255,255,255,0.06)" }} />

            {/* ── Collection tray ── */}
            <div className="absolute bottom-4 left-6 right-6 rounded-2xl" style={{ height: 40, padding: 4, background: "linear-gradient(160deg,#333344,#1a1a28)", boxShadow: "0 3px 10px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)" }}>
              <div className="relative h-full w-full rounded-xl" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.7), rgba(16,12,26,0.6))", border: "1px solid rgba(255,255,255,0.05)", boxShadow: phase === "revealed" ? "inset 0 0 24px rgba(200,150,40,0.4)" : "inset 0 4px 12px rgba(0,0,0,0.8)" }}>
                <motion.div className="absolute inset-x-6 bottom-1.5 h-px rounded-full"
                  animate={{ opacity: phase === "revealed" ? [0.5, 1, 0.5] : 0.1 }}
                  transition={{ duration: 1.3, repeat: phase === "revealed" ? Infinity : 0 }}
                  style={{ background: phase === "revealed" ? "linear-gradient(90deg, transparent, #D4993A, transparent)" : "linear-gradient(90deg, transparent, #7C3AED, transparent)" }} />
              </div>
            </div>
          </div>

          {/* ── Rotation-based lever — pivot at top, arm swings down ── */}
          <Lever onPull={pull} disabled={thinking} />
        </motion.div>

        {/* status / replay */}
        <div className="mt-12 h-10">
          <AnimatePresence mode="wait">
            {phase === "revealed" && (
              <motion.button
                key="again"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={pull}
                className="rounded-full border border-white/15 px-5 py-2 text-[13px] text-white/70 transition-colors hover:border-white/35 hover:text-white"
                style={{ fontFamily: "Fraunces, serif", fontStyle: "italic" }}
              >
                One more joke
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-4 text-[13px] italic text-white/25" style={{ fontFamily: "Fraunces, serif" }}>
          Thank you for your curiosity.
        </p>
      </div>
    </section>
  );
}
