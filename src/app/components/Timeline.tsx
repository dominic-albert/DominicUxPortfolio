import { useRef, useEffect, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import { TrendingUp } from "lucide-react";
import { useEdit } from "./EditContext";
import climbingCharacter from "../../imports/ladder_avatar-1.png";

function MilestoneCard({ m, i }: { m: any; i: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
      className="grid md:grid-cols-[240px_1fr] gap-6 md:gap-12"
    >
      {/* Left: Year & company */}
      <div className="md:pr-10 md:text-right space-y-1 relative">
        <div className="absolute right-0 top-2 translate-x-1/2 w-3 h-3 rounded-full bg-white border-2 border-accent hidden md:block" />
        <p
          className="text-[12px] uppercase tracking-[0.08em] text-muted-foreground"
          style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 500 }}
        >
          {m.year}
        </p>
        <p
          className="text-[18px] text-foreground leading-tight"
          style={{ fontFamily: "Fraunces, serif", fontWeight: 500 }}
        >
          {m.company}
        </p>
        <p
          className="text-[12px] text-muted-foreground"
          style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
        >
          {m.location}
        </p>
      </div>

      {/* Right: Role & achievements */}
      <div className="p-6 md:p-8 bg-card rounded-2xl border border-border hover:border-accent/20 transition-colors duration-300 space-y-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <h3
            className="text-[clamp(1.1rem,2vw,1.35rem)] tracking-[-0.02em]"
            style={{ fontFamily: "Fraunces, serif", fontWeight: 500 }}
          >
            {m.role}
          </h3>
          <span
            className="px-3 py-1 bg-secondary rounded-full text-[11px] uppercase tracking-[0.06em] text-muted-foreground shrink-0"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 500 }}
          >
            {m.type}
          </span>
        </div>
        <ul className="space-y-2.5">
          {m.achievements.map((a: string, j: number) => (
            <li key={j} className="flex gap-3 items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
              <p
                className="text-[14px] text-muted-foreground leading-relaxed"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                {a}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export function Timeline() {
  const titleRef = useRef(null);
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-60px" });
  const { content } = useEdit();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [timelineHeight, setTimelineHeight] = useState(0);

  const careers = content.careers || [];

  // Detect reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Keep timelineHeight in sync reactively
  useEffect(() => {
    const el = timelineRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setTimelineHeight(el.offsetHeight));
    ro.observe(el);
    setTimelineHeight(el.offsetHeight);
    return () => ro.disconnect();
  }, []);

  // Scroll progress anchored to the timeline cards, not the whole section.
  // progress 0 = first card at viewport center, progress 1 = last card at viewport center.
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"],
  });

  // Map progress to vertical position inside the timeline container
  const markerY = useTransform(scrollYProgress, [0, 1], [0, Math.max(0, timelineHeight - 40)]);

  return (
    <section id="experience" className="relative py-16 md:py-36" style={{ position: 'relative' }}>
      <div className="relative max-w-[1320px] mx-auto px-6 md:px-10">
        <div ref={titleRef} className="mb-12 md:mb-20">
          <motion.p
            initial={{ opacity: 0 }}
            animate={titleInView ? { opacity: 1 } : {}}
            className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground mb-4"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 500 }}
          >
            Career Ladder
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] tracking-[-0.03em] max-w-[600px]"
            style={{ fontFamily: "Fraunces, serif", fontWeight: 400 }}
          >
            From practitioner to{" "}
            <em className="text-accent" style={{ fontStyle: "italic" }}>strategic leader.</em>
          </motion.h2>
        </div>

        {/* Timeline */}
        <div className="relative" ref={timelineRef} style={{ position: 'relative' }}>
          {/* Ladder - vertical rails and horizontal rungs */}
          <div className="absolute left-0 md:left-[240px] top-0 bottom-0 hidden md:block pointer-events-none">
            {/* Left rail */}
            <div className="absolute left-[-12px] top-0 bottom-0 w-[4px] bg-border rounded-full" />
            {/* Right rail */}
            <div className="absolute left-[12px] top-0 bottom-0 w-[4px] bg-border rounded-full" />

            {/* Horizontal rungs */}
            {Array.from({ length: Math.max(12, careers.length * 3) }).map((_, i) => (
              <div
                key={i}
                className="absolute left-[-12px] w-[24px] h-[3px] bg-border rounded-full"
                style={{ top: `${i * 80}px` }}
              />
            ))}
          </div>

          {/* Climbing character - respects reduced motion */}
          {!prefersReducedMotion && careers.length > 0 && (
            <motion.div
              className="absolute top-0 hidden md:block pointer-events-none z-10"
              style={{
                y: markerY,
                left: 'calc(240px)',
                x: '-50%'
              }}
            >
              <motion.div
                animate={{
                  rotate: [0, -3, 3, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                {/* Climbing character */}
                <img
                  src={climbingCharacter}
                  alt="Climbing character"
                  className="w-12 h-12 rounded-full shadow-lg"
                  style={{ display: 'block' }}
                />
              </motion.div>
            </motion.div>
          )}

          <div className="space-y-12">
            {careers.length === 0 && (
              <p className="text-center text-muted-foreground py-12">
                No career entries yet. Enter edit mode to add your career journey.
              </p>
            )}
            {careers.map((m: any, i: number) => (
              <MilestoneCard key={m.id || m.company} m={m} i={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
