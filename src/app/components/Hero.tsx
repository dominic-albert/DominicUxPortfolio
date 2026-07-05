import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "motion/react";
import { ArrowDownRight, MapPin, Download, GraduationCap } from "lucide-react";
import { useTheme } from "./ThemeContext";
import { EditableImage } from "./EditableImage";
import { EditableText } from "./EditableText";
import { useEdit } from "./EditContext";
import { TiltCard } from "./TiltCard";

const KEYWORDS = ["Clarity", "Confidence", "Growth"];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

const trustBadges = [
  "10+ Years Experience",
  "Fintech Expert",
  "Healthcare Specialist",
  "Enterprise Products",
];

export function Hero() {
  const { theme } = useTheme();
  const { content, isEditMode } = useEdit();
  const sectionRef = useRef<HTMLElement>(null);
  const [kwIndex, setKwIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setKwIndex(i => (i + 1) % KEYWORDS.length), 2800);
    return () => clearInterval(id);
  }, []);

  const contactInfo = content.contactInfo || {
    email: "dominic.intel@gmail.com",
    linkedin: "https://www.linkedin.com/in/dominic-albert/",
    resumeLink: "#",
  };

  // Mouse position relative to section centre
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  // Portrait card parallax — moves opposite to mouse (subtle depth)
  const cardX = useTransform(smoothX, [-0.5, 0.5], [14, -14]);
  const cardY = useTransform(smoothY, [-0.5, 0.5], [10, -10]);

  // Headline slight tilt
  const headlineX = useTransform(smoothX, [-0.5, 0.5], [-6, 6]);
  const headlineY = useTransform(smoothY, [-0.5, 0.5], [-4, 4]);

  // Grid texture parallax
  const bgX = useTransform(smoothX, [-0.5, 0.5], [-12, 12]);
  const bgY = useTransform(smoothY, [-0.5, 0.5], [-8, 8]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      mouseX.set((e.clientX - cx) / rect.width);
      mouseY.set((e.clientY - cy) / rect.height);
    };
    const onLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };
    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);
    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
    };
  }, [mouseX, mouseY]);

  const scrollToWork = () => {
    document.querySelector("#work")?.scrollIntoView({ behavior: "smooth" });
  };

  const accentColor = theme === "dark" ? "#818CF8" : "#3730A3";
  const gridColor = theme === "dark" ? "rgba(255,255,255,0.04)" : "rgba(10,10,15,0.055)";

  return (
    <section
      ref={sectionRef}
      className="min-h-screen pt-6 md:pt-8 flex flex-col justify-center relative overflow-hidden"
    >
      {/* Parallax grid texture */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          x: bgX,
          y: bgY,
          backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Ambient glow blobs */}
      <motion.div
        className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          x: useTransform(smoothX, [-0.5, 0.5], [30, -30]),
          y: useTransform(smoothY, [-0.5, 0.5], [20, -20]),
          background: theme === "dark"
            ? "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(55,48,163,0.07) 0%, transparent 70%)",
        }}
      />
      {/* Light-mode warm accent blob bottom-left */}
      {theme === "light" && (
        <div
          className="absolute bottom-1/4 -left-32 w-[480px] h-[480px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(251,191,36,0.07) 0%, transparent 70%)",
          }}
        />
      )}

      <div className="max-w-[1320px] mx-auto px-6 md:px-10 w-full">
        <div className="grid md:grid-cols-[1fr_auto] gap-16 md:gap-24 items-center py-8 md:py-12">
          {/* Left: Text content */}
          <div className="space-y-10">
            {/* Availability badge */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.1}
            >
              <div
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 w-fit"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span
                  className="text-[13px] text-emerald-700 dark:text-emerald-400"
                  style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 600 }}
                >
                  Available for new opportunities
                </span>
              </div>
            </motion.div>

            {/* Headline with rotating keyword */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.2}
              style={{ x: headlineX, y: headlineY }}
            >
              <h1
                className="text-[clamp(3rem,6vw,5.5rem)] leading-[1.12] tracking-[-0.03em] text-foreground"
                style={{ fontFamily: "Fraunces, serif", fontWeight: 400 }}
              >
                Designing products<br className="hidden sm:block" /> that drive{" "}
                {/*
                  Clip container: height = one line of this font size so the
                  sliding word never shows above or below the line.
                */}
                <span
                  style={{
                    display: "inline-block",
                    verticalAlign: "bottom",
                    overflow: "hidden",
                    lineHeight: "inherit",
                  }}
                >
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.em
                      key={kwIndex}
                      initial={{ y: "100%", opacity: 0 }}
                      animate={{ y: "0%", opacity: 1 }}
                      exit={{ y: "-40%", opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        display: "inline-block",
                        fontStyle: "italic",
                        color: "var(--accent)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {KEYWORDS[kwIndex]}
                    </motion.em>
                  </AnimatePresence>
                </span>
              </h1>
            </motion.div>

            {/* Subheadline */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.35}
            >
              <EditableText
                contentKey="hero:subheadline"
                defaultValue="Product Designer with 9+ years of experience creating user-centered solutions across Healthcare, FinTech, Enterprise, and AI Native Digital Platforms."
                as="p"
                multiline
                className="text-[clamp(1rem,1.4vw,1.2rem)] text-muted-foreground leading-[1.7] max-w-[560px]"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 400 }}
              />
            </motion.div>

            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.45}
              className="flex flex-wrap items-center gap-4"
            >
              <motion.button
                onClick={scrollToWork}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="btn-glass liquid-sheen group inline-flex items-center gap-2 px-8 py-4 bg-foreground/85 text-background rounded-full hover:bg-accent hover:text-white text-[14px]"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 600 }}
              >
                View Case Studies
                <ArrowDownRight
                  size={16}
                  className="group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform"
                />
              </motion.button>
              <motion.a
                href={contactInfo.resumeLink}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="btn-glass liquid-sheen inline-flex items-center gap-2 px-8 py-4 bg-foreground/5 border border-border rounded-full hover:border-foreground/40 text-[14px] text-foreground"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 500 }}
              >
                <Download size={15} />
                Download Resume
              </motion.a>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.55}
              className="flex flex-wrap gap-2.5 pt-2"
            >
              {trustBadges.map((badge) => (
                <span
                  key={badge}
                  className="px-4 py-1.5 bg-secondary rounded-full text-[12px] text-muted-foreground"
                  style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 500 }}
                >
                  {badge}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right: Portrait card with parallax */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            style={{ x: cardX, y: cardY }}
            className="hidden md:flex flex-col gap-5 w-[300px]"
          >
            {/* Portrait */}
            <TiltCard className="group rounded-2xl overflow-hidden bg-secondary aspect-[3/4] liquid-glow">
              <EditableImage
                contentKey="hero:portrait"
                defaultSrc="https://nhacjctomeiflaqybgql.supabase.co/storage/v1/object/sign/make-80528481-portfolio/1780769031698-Profile_pic.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wZDJiMWZiNi1lYTU0LTQzMzktOGQzOS1hMmY0MzFlM2Q0ZjIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYWtlLTgwNTI4NDgxLXBvcnRmb2xpby8xNzgwNzY5MDMxNjk4LVByb2ZpbGVfcGljLmpwZyIsImlhdCI6MTc4MDg2MjQ4MCwiZXhwIjo0OTM0NDYyNDgwfQ.1pMb2fzL580QiocP3WUMgKp9xXqcO6P3M_lPG1Rf_94"
                alt="Dominic, Senior Product Designer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              <motion.div
                className="absolute bottom-5 left-5 px-3 py-1.5 rounded-full bg-background/90 backdrop-blur border border-border"
                whileHover={{ scale: 1.05 }}
              >
                <EditableText
                  contentKey="about:greeting"
                  defaultValue="Hi, I'm Dominic 👋"
                  as="p"
                  className="text-[11px] tracking-[0.12em] uppercase text-foreground"
                  style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 600 }}
                />
              </motion.div>
            </TiltCard>

            {/* Info card */}
            <TiltCard
              className="group liquid-glass liquid-sheen liquid-glow p-5 rounded-2xl space-y-4"
              max={isEditMode ? 0 : 8}
              glare={!isEditMode}
            >
              <div>
                <p
                  className="text-[13px] text-muted-foreground"
                  style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                >
                  Current Role
                </p>
                <EditableText
                  contentKey="hero:current-role"
                  defaultValue="Lead Product Designer @ Altimetrik"
                  as="p"
                  className="text-[14px] font-medium text-foreground"
                  style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                />
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center gap-2 text-muted-foreground">
                <GraduationCap size={13} className="shrink-0" />
                <div className="flex items-center gap-1">
                  <EditableText
                    contentKey="hero:education-1"
                    defaultValue="B.Tech IT"
                    as="span"
                    className="text-[13px]"
                    style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                  />
                  <span className="text-[13px]">·</span>
                  <EditableText
                    contentKey="hero:education-2"
                    defaultValue="MBA"
                    as="span"
                    className="text-[13px]"
                    style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin size={13} />
                <EditableText
                  contentKey="hero:location"
                  defaultValue="Chennai,TN"
                  as="span"
                  className="text-[13px]"
                  style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <EditableText
                  contentKey="hero:experience"
                  defaultValue="9+ years of experience"
                  as="span"
                  className="text-[13px] text-muted-foreground"
                  style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                />
              </div>
            </TiltCard>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
