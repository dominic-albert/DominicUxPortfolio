import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  progress: number; // 0–100
  visible: boolean;
}

const CHARS = "Dominic.".split("");

export function Preloader({ progress, visible }: Props) {
  const [displayed, setDisplayed] = useState(0);

  // Smoothly count up the displayed number
  useEffect(() => {
    const diff = progress - displayed;
    if (diff <= 0) return;
    const step = Math.ceil(diff / 6);
    const t = setTimeout(() => setDisplayed(n => Math.min(n + step, progress)), 40);
    return () => clearTimeout(t);
  }, [progress, displayed]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          initial={{ y: 0 }}
          exit={{ y: "-100%", transition: { duration: 0.82, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden select-none"
          style={{ background: "#07070d" }}
        >
          {/* Grid texture */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(129,140,248,0.05) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(129,140,248,0.05) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
              maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black, transparent)",
              WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black, transparent)",
            }}
          />

          {/* Ambient violet glow */}
          <motion.div
            className="pointer-events-none absolute rounded-full"
            animate={{ scale: [1, 1.12, 1], opacity: [0.28, 0.45, 0.28] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: 520,
              height: 520,
              background: "radial-gradient(circle, rgba(124,58,237,0.22), transparent 68%)",
            }}
          />

          {/* Corner accents */}
          <div className="pointer-events-none absolute top-8 left-8 w-10 h-10 border-t border-l" style={{ borderColor: "rgba(167,139,250,0.2)" }} />
          <div className="pointer-events-none absolute top-8 right-8 w-10 h-10 border-t border-r" style={{ borderColor: "rgba(167,139,250,0.2)" }} />
          <div className="pointer-events-none absolute bottom-8 left-8 w-10 h-10 border-b border-l" style={{ borderColor: "rgba(167,139,250,0.2)" }} />
          <div className="pointer-events-none absolute bottom-8 right-8 w-10 h-10 border-b border-r" style={{ borderColor: "rgba(167,139,250,0.2)" }} />

          {/* Main content */}
          <div className="relative flex flex-col items-center gap-0">

            {/* Label above name */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "Plus Jakarta Sans, sans-serif",
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "rgba(167,139,250,0.70)",
                marginBottom: 16,
              }}
            >
              Portfolio
            </motion.p>

            {/* Name — letters staggered in */}
            <div className="flex" style={{ gap: 0 }}>
              {CHARS.map((ch, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    delay: 0.18 + i * 0.055,
                    duration: 0.65,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{
                    fontFamily: "Fraunces, serif",
                    fontSize: "clamp(56px, 10vw, 100px)",
                    fontWeight: 300,
                    fontStyle: "italic",
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                    color: ch === "." ? "rgba(167,139,250,0.85)" : "rgba(255,255,255,0.92)",
                    display: "inline-block",
                  }}
                >
                  {ch}
                </motion.span>
              ))}
            </div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.7 }}
              style={{
                fontFamily: "Plus Jakarta Sans, sans-serif",
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.8)",
                marginTop: 14,
              }}
            >
              Preparing your first impression.
            </motion.p>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.65, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: 220, height: 1, background: "rgba(255,255,255,0.07)", borderRadius: 1, marginTop: 32, position: "relative", overflow: "hidden" }}
            >
              <motion.div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(90deg, rgba(139,92,246,0.6), rgba(167,139,250,1))",
                  borderRadius: 1,
                  transformOrigin: "left center",
                }}
                animate={{ scaleX: progress / 100 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
              {/* Shimmer */}
              <motion.div
                style={{ position: "absolute", top: 0, bottom: 0, width: 40, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)" }}
                animate={{ x: ["-40px", "260px"] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "linear", repeatDelay: 0.4 }}
              />
            </motion.div>

            {/* Percentage */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              style={{
                fontFamily: "Plus Jakarta Sans, sans-serif",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.12em",
                color: "rgba(167,139,250,0.5)",
                marginTop: 10,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {displayed < 100 ? `${displayed}%` : "✦  Ready"}
            </motion.p>
          </div>

          {/* Bottom signature */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="absolute bottom-8"
            style={{
              fontFamily: "Fraunces, serif",
              fontStyle: "italic",
              fontSize: 11,
              color: "rgba(255,255,255,0.12)",
            }}
          >
            Crafting the experience…
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
