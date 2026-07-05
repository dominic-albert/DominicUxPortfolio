import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { useEdit } from "./EditContext";

export function LogoCarousel() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const { content } = useEdit();

  const logos = content.logos || [];
  const track = [...logos, ...logos];

  if (logos.length === 0) return null;

  return (
    <section
      ref={ref}
      className="py-8 border-t border-b border-border overflow-hidden bg-background flex flex-col items-center justify-center"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="relative w-full"
      >
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-28 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div
          className="flex items-center"
          style={{
            animation: "marquee 36s linear infinite",
            width: "max-content",
            gap: "64px",
          }}
        >
          {track.map((logo, i) => (
            <span
              key={`${logo.abbr}-${i}`}
              className="shrink-0 text-foreground/30 hover:text-foreground/60 transition-colors duration-300 select-none whitespace-nowrap"
              style={{
                fontFamily: "Fraunces, serif",
                fontWeight: 500,
                fontSize: "clamp(1.4rem, 2.4vw, 2rem)",
                letterSpacing: "-0.02em",
              }}
              title={logo.name}
            >
              {logo.abbr}
            </span>
          ))}
        </div>
      </motion.div>

      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
