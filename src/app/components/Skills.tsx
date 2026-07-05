import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Microscope, Palette, Users, Wrench } from "lucide-react";

const skillGroups = [
  {
    category: "Research & Strategy",
    Icon: Microscope,
    accent: "#818CF8",
    light: "rgba(129,140,248,0.12)",
    skills: [
      { name: "User Research", level: 95 },
      { name: "Stakeholder Mapping", level: 90 },
      { name: "Competitive Analysis", level: 88 },
      { name: "Product Strategy", level: 92 },
      { name: "Behavioral Design", level: 85 },
    ],
  },
  {
    category: "Design Practice",
    Icon: Palette,
    accent: "#34D399",
    light: "rgba(52,211,153,0.12)",
    skills: [
      { name: "Interaction Design", level: 96 },
      { name: "Visual Design", level: 94 },
      { name: "Service Design", level: 88 },
      { name: "Design Systems", level: 95 },
      { name: "Accessibility (WCAG 2.1)", level: 90 },
    ],
  },
  {
    category: "Facilitation & Leadership",
    Icon: Users,
    accent: "#FB923C",
    light: "rgba(251,146,60,0.12)",
    skills: [
      { name: "Workshop Facilitation", level: 92 },
      { name: "Design Critiques", level: 95 },
      { name: "Team Mentorship", level: 90 },
      { name: "Usability Testing", level: 93 },
      { name: "Stakeholder Management", level: 88 },
    ],
  },
  {
    category: "Tools & Craft",
    Icon: Wrench,
    accent: "#A78BFA",
    light: "rgba(167,139,250,0.12)",
    skills: [
      { name: "Figma", level: 98 },
      { name: "Prototyping", level: 95 },
      { name: "FigJam", level: 92 },
      { name: "Maze", level: 85 },
      { name: "Dovetail", level: 82 },
      { name: "Miro", level: 90 },
      { name: "Notion", level: 95 },
    ],
  },
];

export function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 md:py-36 bg-secondary/40 relative overflow-hidden">
      {/* Decorative dotted background */}
      <div
        className="absolute inset-0 opacity-[0.4] dark:opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, var(--muted-foreground) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
      <div className="absolute -top-20 right-1/4 w-96 h-96 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

      <div className="max-w-[1320px] mx-auto px-6 md:px-10 relative">
        <div ref={ref} className="mb-16 md:mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              className="text-[11px] uppercase tracking-[0.12em] text-accent mb-4"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 600 }}
            >
              Skills & Expertise
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] tracking-[-0.03em] max-w-[640px] text-foreground"
              style={{ fontFamily: "Fraunces, serif", fontWeight: 400 }}
            >
              Broad skills,{" "}
              <em className="text-accent" style={{ fontStyle: "italic" }}>deep expertise.</em>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[14px] text-muted-foreground max-w-xs leading-relaxed"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            A T-shaped practice — wide enough to lead cross-functional work, deep enough to ship the details.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {skillGroups.map((group, i) => {
            const Icon = group.Icon;
            return (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.1 + i * 0.08 }}
                className="group relative p-7 rounded-3xl border border-border bg-card overflow-hidden hover:-translate-y-1 transition-transform duration-500 hover:shadow-2xl hover:shadow-black/10 dark:hover:shadow-black/40"
              >
                {/* Accent glow */}
                <div
                  className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-50 group-hover:opacity-90 transition-opacity duration-500"
                  style={{ backgroundColor: group.light }}
                />

                {/* Header */}
                <div className="relative flex items-center gap-4 mb-7">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: group.light,
                      color: group.accent,
                      boxShadow: `0 0 24px ${group.light}`,
                    }}
                  >
                    <Icon size={20} strokeWidth={2} />
                  </div>
                  <div>
                    <h3
                      className="text-[18px] text-foreground"
                      style={{ fontFamily: "Fraunces, serif", fontWeight: 500 }}
                    >
                      {group.category}
                    </h3>
                    <p
                      className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground mt-0.5"
                      style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 500 }}
                    >
                      {group.skills.length} disciplines
                    </p>
                  </div>
                </div>

                {/* Skills with progress bars */}
                <div className="relative space-y-3.5">
                  {group.skills.map((skill, j) => (
                    <div key={skill.name} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span
                          className="text-[13px] text-foreground"
                          style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 500 }}
                        >
                          {skill.name}
                        </span>
                        <span
                          className="text-[11px] tabular-nums"
                          style={{
                            fontFamily: "Plus Jakarta Sans, sans-serif",
                            fontWeight: 600,
                            color: group.accent,
                          }}
                        >
                          {skill.level}
                        </span>
                      </div>
                      <div className="relative h-1.5 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={inView ? { width: `${skill.level}%` } : {}}
                          transition={{
                            duration: 1.2,
                            delay: 0.3 + i * 0.08 + j * 0.05,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="absolute inset-y-0 left-0 rounded-full"
                          style={{
                            background: `linear-gradient(90deg, ${group.accent}99, ${group.accent})`,
                            boxShadow: `0 0 12px ${group.accent}80`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
