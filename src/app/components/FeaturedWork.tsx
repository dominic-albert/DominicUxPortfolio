import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { ExternalLink, Lock } from "lucide-react";
import { useEdit } from "./EditContext";
import { TiltCard } from "./TiltCard";

function PasswordGate({ url, password, onClose }: { url: string; password: string; onClose: () => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  const attempt = (entered: string) => {
    if (entered === password) {
      window.open(url, "_blank");
      onClose();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center">
            <Lock size={16} className="text-accent" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-foreground" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Password protected</p>
            <p className="text-[11px] text-muted-foreground" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Enter the password to view this case study</p>
          </div>
        </div>

        <input
          autoFocus
          type="password"
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(false); }}
          onKeyDown={(e) => e.key === "Enter" && attempt(value)}
          placeholder="Password"
          className={`w-full px-4 py-3 rounded-xl border bg-background text-foreground text-[14px] outline-none transition-colors ${
            error ? "border-red-400 focus:border-red-400" : "border-border focus:border-accent"
          }`}
          style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
        />
        {error && (
          <p className="mt-2 text-[12px] text-red-400" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Incorrect password. Try again.</p>
        )}

        <div className="flex gap-3 mt-5">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-border text-[13px] text-muted-foreground hover:text-foreground transition-colors"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            Cancel
          </button>
          <button
            onClick={() => attempt(value)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-accent text-white text-[13px] font-medium hover:opacity-90 transition-opacity"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            Unlock
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function ProjectCard({ project, index }: { project: any; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const isLarge = project.featured;
  const [showGate, setShowGate] = useState(false);

  const hasLink = project.caseStudyLink && project.caseStudyLink !== "#";
  const hasPassword = hasLink && project.caseStudyPassword;

  const handleClick = () => {
    if (!hasLink) return;
    if (hasPassword) {
      setShowGate(true);
    } else {
      window.open(project.caseStudyLink, "_blank");
    }
  };

  return (
    <>
      <AnimatePresence>
        {showGate && (
          <PasswordGate
            url={project.caseStudyLink}
            password={project.caseStudyPassword}
            onClose={() => setShowGate(false)}
          />
        )}
      </AnimatePresence>
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
      className={isLarge ? "col-span-1 md:col-span-1" : "col-span-1"}
    >
    <TiltCard
      max={6}
      onClick={handleClick}
      className={`group liquid-sheen portfolio-card-glow rounded-2xl overflow-hidden ${
        project.caseStudyLink && project.caseStudyLink !== "#" ? "cursor-pointer" : ""
      } flex flex-col h-full`}
      style={{ background: project.accent || "#F5F4F0" }}
    >
      {/* Image */}
      <div
        className="relative overflow-hidden w-full"
        style={{ aspectRatio: '16 / 10.80' }}
      >
        <motion.img
          src={project.thumbnail}
          alt={project.title}
          initial={{ filter: "blur(10px) saturate(0.92)", scale: 1.015 }}
          animate={inView ? { filter: "blur(0px) saturate(1)", scale: 1 } : {}}
          transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 + 0.12 }}
          className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
        />
        <motion.img
          src={project.thumbnail}
          alt=""
          aria-hidden
          initial={{ opacity: 0.72, filter: "blur(1.5px) contrast(1.1)", scale: 1.035 }}
          animate={inView ? { opacity: 0, filter: "blur(0px) contrast(1)", scale: 1.01 } : {}}
          transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none [image-rendering:pixelated]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

        {/* Tags */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {project.tags && project.tags.slice(0, 2).map((tag: string, i: number) => (
            <span
              key={i}
              className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[11px] uppercase tracking-[0.08em] text-gray-900"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 600 }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Hover arrow / lock badge */}
        {hasLink && (
          <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/0 group-hover:bg-white/90 backdrop-blur-sm flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
            {hasPassword ? <Lock size={15} className="text-foreground" /> : <ExternalLink size={16} className="text-foreground" />}
          </div>
        )}
        {/* Always-visible lock pill */}
        {hasPassword && (
          <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-full bg-black/40 backdrop-blur-sm group-hover:opacity-0 transition-opacity duration-200">
            <Lock size={10} className="text-white/70" />
            <span className="text-[9px] text-white/70 uppercase tracking-wide" style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 600 }}>Protected</span>
          </div>
        )}

        {/* Outcome on image bottom */}
        {project.outcome && (
          <div className="absolute bottom-4 left-4 right-4">
            <p
              className="text-white/90 text-[clamp(1.1rem,2vw,1.4rem)] leading-tight"
              style={{ fontFamily: "Fraunces, serif", fontWeight: 400, fontStyle: "italic" }}
            >
              "{project.outcome}"
            </p>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-6 space-y-3 bg-white dark:bg-[#18181f] flex-1">
        <div className="flex items-start justify-between gap-4">
          <h3
            className="text-[clamp(1rem,1.5vw,1.15rem)] leading-snug tracking-[-0.02em] text-gray-900 dark:text-white"
            style={{ fontFamily: "Fraunces, serif", fontWeight: 500 }}
          >
            {project.title}
          </h3>
        </div>
        <p
          className="text-[14px] text-gray-600 dark:text-gray-300 leading-relaxed"
          style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
        >
          {project.description}
        </p>
        {hasLink && (
          <div className="pt-1 flex items-center gap-2">
            {hasPassword && <Lock size={12} className="text-accent shrink-0" />}
            <span
              className="text-[13px] text-accent font-medium group-hover:underline underline-offset-2 transition-all"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              {hasPassword ? "View case study (protected)" : "View case study →"}
            </span>
          </div>
        )}
      </div>
    </TiltCard>
    </motion.div>
    </>
  );
}

function ProjectCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-card border border-border/40 animate-pulse">
      <div className="w-full bg-muted" style={{ aspectRatio: "16 / 10.80" }} />
      <div className="p-6 space-y-3 bg-white dark:bg-[#18181f]">
        <div className="h-5 w-2/3 rounded-md bg-muted" />
        <div className="space-y-2">
          <div className="h-3.5 w-full rounded bg-muted" />
          <div className="h-3.5 w-4/5 rounded bg-muted" />
        </div>
        <div className="h-3 w-1/4 rounded bg-muted pt-1" />
      </div>
    </div>
  );
}

const PAGE = 4;

export function FeaturedWork() {
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-60px" });
  const { projects, isLoading } = useEdit();
  const [showAll, setShowAll] = useState(false);

  const allProjects = projects;
  const visible = showAll ? allProjects : allProjects.slice(0, PAGE);
  const hasMore = allProjects.length > PAGE;

  const featuredVisible = visible.filter((p: any) => p.featured);
  const otherVisible = visible.filter((p: any) => !p.featured);

  return (
    <section id="work" className="py-16 md:py-36">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        {/* Section header */}
        <div ref={titleRef} className="mb-12 md:mb-20">
          <motion.p
            initial={{ opacity: 0 }}
            animate={titleInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground mb-4"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 500 }}
          >
            Selected Work
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] tracking-[-0.03em] max-w-[640px]"
            style={{ fontFamily: "Fraunces, serif", fontWeight: 400 }}
          >Work that moves the <em className="text-accent" style={{ fontStyle: "italic" }}>needle.</em></motion.h2>
        </div>

        {/* Projects grid */}
        {isLoading ? (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <ProjectCardSkeleton />
              <ProjectCardSkeleton />
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-8">
              {featuredVisible.length > 0 && (
                <div className="grid md:grid-cols-2 gap-8">
                  {featuredVisible.map((p: any, i: number) => (
                    <ProjectCard key={p.id} project={p} index={i} />
                  ))}
                </div>
              )}
              {otherVisible.length > 0 && (
                <div className="grid md:grid-cols-2 gap-8">
                  {otherVisible.map((p: any, i: number) => (
                    <ProjectCard key={p.id} project={p} index={i + featuredVisible.length} />
                  ))}
                </div>
              )}
            </div>

            {hasMore && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="mt-14 flex justify-center"
              >
                <button
                  onClick={() => setShowAll(v => !v)}
                  className="group flex items-center gap-3 px-7 py-3.5 rounded-full border border-border hover:border-accent/50 transition-all duration-300 hover:bg-accent/5"
                  style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 500, fontSize: 14 }}
                >
                  <span className="text-foreground/70 group-hover:text-foreground transition-colors">
                    {showAll ? "Show less" : `See all projects (${allProjects.length})`}
                  </span>
                  <motion.span
                    animate={{ rotate: showAll ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="text-accent text-[18px] leading-none"
                  >
                    ↓
                  </motion.span>
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
