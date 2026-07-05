import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useEdit } from "./EditContext";

// ─── Ring Cursor ──────────────────────────────────────────────────────────────

function RingCursor() {
  const [hovering, setHovering] = useState(false);
  const [grab, setGrab] = useState(false);
  const [down, setDown] = useState(false);
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);

  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);
  const ringX = useSpring(mouseX, { stiffness: 160, damping: 22, mass: 0.8 });
  const ringY = useSpring(mouseY, { stiffness: 160, damping: 22, mass: 0.8 });
  const dotX = useSpring(mouseX, { stiffness: 900, damping: 40, mass: 0.15 });
  const dotY = useSpring(mouseY, { stiffness: 900, damping: 40, mass: 0.15 });

  const counter = useRef(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      const id = counter.current++;
      setTrail((p) => [...p.slice(-6), { x: e.clientX, y: e.clientY, id }]);
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      setGrab(!!t?.closest("[data-grab]"));
      setHovering(!!t?.closest("a,button,[role='button'],[data-cursor],input,textarea,select,label"));
    };
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      {trail.map((pt, i) => (
        <div
          key={pt.id}
          className="fixed top-0 left-0 z-[9990] pointer-events-none rounded-full"
          style={{
            width: 6, height: 6,
            transform: `translate(calc(${pt.x}px - 50%), calc(${pt.y}px - 50%)) scale(${0.2 + (i / trail.length) * 0.5})`,
            background: "var(--accent)",
            opacity: ((i + 1) / trail.length) * 0.45,
            transition: "opacity 0.3s ease",
          }}
        />
      ))}

      <motion.div
        className="fixed top-0 left-0 z-[9998] pointer-events-none rounded-full"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{ width: grab ? 48 : hovering ? 52 : 36, height: grab ? 48 : hovering ? 52 : 36, scale: down ? 0.75 : 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
      >
        <div className="w-full h-full rounded-full" style={{
          border: hovering || grab ? "1.5px solid var(--accent)" : "1px solid color-mix(in srgb, var(--accent) 55%, transparent)",
          background: hovering ? "color-mix(in srgb, var(--accent) 10%, transparent)" : grab ? "color-mix(in srgb, var(--accent) 15%, transparent)" : "transparent",
          boxShadow: hovering || grab ? "0 0 20px -4px color-mix(in srgb, var(--accent) 60%, transparent)" : "none",
          backdropFilter: hovering ? "blur(1px)" : "none",
        }} />
      </motion.div>

      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: grab ? 1.8 : hovering ? 0 : down ? 2 : 1 }}
        transition={{ type: "spring", stiffness: 600, damping: 28 }}
      >
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--foreground)", mixBlendMode: "difference" }} />
      </motion.div>

      {hovering && (
        <motion.div
          className="fixed top-0 left-0 z-[9997] pointer-events-none rounded-full"
          style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
          initial={{ width: 52, height: 52, opacity: 0.5 }}
          animate={{ width: 80, height: 80, opacity: 0 }}
          transition={{ duration: 0.6, repeat: Infinity, ease: "easeOut" }}
        >
          <div className="w-full h-full rounded-full" style={{ border: "1px solid var(--accent)" }} />
        </motion.div>
      )}
    </>
  );
}

// ─── Fancy Cursor ─────────────────────────────────────────────────────────────

type Sparkle = { id: number; x: number; y: number; angle: number; dist: number };

function FancyCursor() {
  const [hovering, setHovering] = useState(false);
  const [down, setDown] = useState(false);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [pos, setPos] = useState({ x: -200, y: -200 });

  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);
  const springX = useSpring(mouseX, { stiffness: 700, damping: 38, mass: 0.2 });
  const springY = useSpring(mouseY, { stiffness: 700, damping: 38, mass: 0.2 });

  const sparkleCounter = useRef(0);
  const lastSparkle = useRef(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setPos({ x: e.clientX, y: e.clientY });

      const now = Date.now();
      if (now - lastSparkle.current > 80) {
        lastSparkle.current = now;
        const id = sparkleCounter.current++;
        const angle = Math.random() * 360;
        const dist = 10 + Math.random() * 18;
        setSparkles((p) => [...p.slice(-10), { id, x: e.clientX, y: e.clientY, angle, dist }]);
        setTimeout(() => setSparkles((p) => p.filter((s) => s.id !== id)), 600);
      }
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      setHovering(!!t?.closest("a,button,[role='button'],[data-cursor],input,textarea,select,label"));
    };
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Sparkle particles */}
      {sparkles.map((s) => {
        const rad = (s.angle * Math.PI) / 180;
        return (
          <motion.div
            key={s.id}
            className="fixed top-0 left-0 z-[9990] pointer-events-none"
            style={{ x: s.x, y: s.y, translateX: "-50%", translateY: "-50%" }}
            initial={{ opacity: 0.9, scale: 1, x: s.x, y: s.y }}
            animate={{
              opacity: 0,
              scale: 0,
              x: s.x + Math.cos(rad) * s.dist,
              y: s.y + Math.sin(rad) * s.dist,
            }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            {/* 4-point star */}
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <path d="M4 0L4.6 3.4L8 4L4.6 4.6L4 8L3.4 4.6L0 4L3.4 3.4Z" fill="var(--accent)" />
            </svg>
          </motion.div>
        );
      })}

      {/* Hover glow halo */}
      {hovering && (
        <motion.div
          className="fixed top-0 left-0 z-[9991] pointer-events-none rounded-full"
          style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
          initial={{ width: 36, height: 36, opacity: 0.6 }}
          animate={{ width: 64, height: 64, opacity: 0 }}
          transition={{ duration: 0.5, repeat: Infinity, ease: "easeOut" }}
        >
          <div className="w-full h-full rounded-full" style={{ border: "1px solid var(--accent)" }} />
        </motion.div>
      )}

      {/* Main custom arrow SVG */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{ x: springX, y: springY }}
        animate={{ scale: down ? 0.82 : hovering ? 1.15 : 1, rotate: down ? -6 : 0 }}
        transition={{ type: "spring", stiffness: 420, damping: 26 }}
      >
        <svg
          width="28"
          height="34"
          viewBox="0 0 28 34"
          fill="none"
          style={{ filter: hovering ? "drop-shadow(0 0 8px var(--accent))" : "drop-shadow(0 2px 6px rgba(0,0,0,0.4))" }}
        >
          {/* Arrow body */}
          <path
            d="M3 2L25 14L15 16L19 31L14 33L10 18L3 22L3 2Z"
            fill="var(--accent)"
            stroke="white"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          {/* Inner highlight */}
          <path
            d="M6 6L20 14.5L13 16L6 6Z"
            fill="white"
            fillOpacity="0.25"
          />
        </svg>
      </motion.div>
    </>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────

export function MouseFollower() {
  const { content } = useEdit();
  const style: "off" | "ring" | "fancy" = (content["feature:cursorStyle"] as any) ?? "off";
  const [isFinePointer, setIsFinePointer] = useState(false);

  useEffect(() => {
    setIsFinePointer(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  useEffect(() => {
    const hide = style !== "off" && isFinePointer;
    document.documentElement.style.cursor = hide ? "none" : "";
    const els = document.querySelectorAll("a,button,[role='button'],input,textarea,select,label,[data-grab]");
    els.forEach((el) => { (el as HTMLElement).style.cursor = hide ? "none" : ""; });
    return () => { document.documentElement.style.cursor = ""; };
  }, [style, isFinePointer]);

  if (!isFinePointer || style === "off") return null;
  if (style === "fancy") return <FancyCursor />;
  return <RingCursor />;
}
