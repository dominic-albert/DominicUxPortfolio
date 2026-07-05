import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { ToolsGrid } from "./ToolsGrid";

const ACCENT = "#A78BFA";

/* ─────────────────────────────────────────────────────────────
   Types & data
───────────────────────────────────────────────────────────── */
type FwId = "ai" | "standard" | "lean";

interface Step {
  id: string;
  num: string;
  tab: string;
  title: string;
  story: string;
  outcome: string;
  skills: string[]; // max 5 hashtags
}

interface Framework {
  id: FwId;
  label: string;
  steps: Step[];
}

const frameworks: Framework[] = [
  {
    id: "ai",
    label: "AI Driven",
    steps: [
      {
        id: "understand",  num: "01", tab: "Understand", title: "Finding the Signal",
        story: "Every engagement begins with uncertainty. Stakeholder expectations, business constraints, user frustrations, and fragmented data often point in different directions.",
        outcome: "A shared understanding of the problem worth solving.",
        skills: ["#ContextMapping", "#SystemsThinking", "#AIAnalysis", "#StakeholderIntelligence", "#ProblemFraming"],
      },
      {
        id: "discover", num: "02", tab: "Discover", title: "Turning Data into Direction",
        story: "Research, analytics, and AI-powered synthesis reveal hidden patterns that separate noise from opportunity.",
        outcome: "Actionable insights and opportunity spaces.",
        skills: ["#AIResearch", "#DataSynthesis", "#PatternRecognition", "#BehavioralAnalysis", "#InsightGeneration"],
      },
      {
        id: "imagine", num: "03", tab: "Imagine", title: "Exploring Possible Futures",
        story: "Rather than settling on the first solution, multiple concepts are generated, challenged, and refined to uncover the strongest direction.",
        outcome: "Validated concepts and experience directions.",
        skills: ["#AIIdeation", "#PromptEngineering", "#ConceptExploration", "#FutureDesign", "#CreativeSynthesis"],
      },
      {
        id: "validate", num: "04", tab: "Validate", title: "Grounding Ideas in Reality",
        story: "Technology suggests. Humans decide. Testing and feedback reveal what resonates and what requires refinement.",
        outcome: "Evidence-based design decisions.",
        skills: ["#UserValidation", "#FeedbackLoops", "#BehaviorTesting", "#AIPrototyping", "#IterativeDesign"],
      },
      {
        id: "build", num: "05", tab: "Build", title: "Designing Systems, Not Screens",
        story: "Experiences evolve into scalable systems where interfaces, workflows, and AI interactions work together seamlessly.",
        outcome: "Production-ready experiences and scalable design systems.",
        skills: ["#DesignSystems", "#AIWorkflows", "#ComponentArchitecture", "#ExperienceEngineering", "#Prototyping"],
      },
      {
        id: "grow", num: "06", tab: "Grow", title: "Learning Beyond Launch",
        story: "Launch is not the finish line. Continuous measurement, AI insights, and user feedback drive ongoing optimisation.",
        outcome: "Business impact and sustained growth.",
        skills: ["#AIOptimisation", "#ContinuousLearning", "#MetricsDriven", "#GrowthDesign", "#ImpactMeasurement"],
      },
    ],
  },
  {
    id: "standard",
    label: "Standard UX",
    steps: [
      {
        id: "research", num: "01", tab: "Research", title: "Listening Before Designing",
        story: "Deep understanding of users, business context, and market landscape lays the foundation for decisions grounded in reality rather than assumptions.",
        outcome: "Rich user understanding and a clear problem space.",
        skills: ["#UserInterviews", "#ContextualInquiry", "#EthnographicStudy", "#SurveyDesign", "#StakeholderMapping"],
      },
      {
        id: "analysis", num: "02", tab: "Analysis", title: "Making Sense of the Data",
        story: "Raw research becomes structured insight through synthesis techniques that surface patterns, mental models, and design opportunities.",
        outcome: "Personas, journey maps, and prioritised opportunities.",
        skills: ["#AffinityMapping", "#ThematicAnalysis", "#PersonaDevelopment", "#JourneyMapping", "#InsightSynthesis"],
      },
      {
        id: "ideation", num: "03", tab: "Ideation", title: "Expanding the Solution Space",
        story: "Structured ideation methods help teams think beyond the obvious and explore a wide range of creative directions before narrowing down.",
        outcome: "Diverse concepts ready for evaluation and refinement.",
        skills: ["#DesignThinking", "#HowMightWe", "#ConceptGeneration", "#SketchingSessions", "#BrainstormFacilitation"],
      },
      {
        id: "design", num: "04", tab: "Design", title: "Shaping the Experience",
        story: "Ideas become tangible through considered interaction design, visual systems, and accessible component architecture built for scale.",
        outcome: "High-fidelity designs and a coherent design system.",
        skills: ["#InteractionDesign", "#VisualDesign", "#DesignSystems", "#HighFidelity", "#Accessibility"],
      },
      {
        id: "testing", num: "05", tab: "Testing", title: "Proving Before Building",
        story: "Rigorous testing methods validate design decisions with real users, uncovering friction points before they become expensive engineering problems.",
        outcome: "Validated designs and evidence-based refinements.",
        skills: ["#UsabilityTesting", "#HeuristicEvaluation", "#A_BTesting", "#CognitiveWalkthrough", "#TreeTesting"],
      },
      {
        id: "delivery", num: "06", tab: "Delivery", title: "Handoff with Intention",
        story: "Precise developer collaboration, quality assurance, and post-launch measurement ensure the vision survives contact with production.",
        outcome: "Shipped experience and a baseline for future improvement.",
        skills: ["#DesignHandoff", "#DeveloperCollaboration", "#QualityAssurance", "#LaunchStrategy", "#BaselineMetrics"],
      },
    ],
  },
  {
    id: "lean",
    label: "Lean UX",
    steps: [
      {
        id: "assumptions", num: "01", tab: "Assumptions", title: "Surfacing What We Believe",
        story: "Teams surface and document their beliefs about users, business, and technology — making invisible assumptions explicit and challengeable.",
        outcome: "A mapped set of riskiest assumptions to test first.",
        skills: ["#AssumptionMapping", "#LeanThinking", "#RiskAssessment", "#BeliefAudit", "#HypothesisFirst"],
      },
      {
        id: "hypothesis", num: "02", tab: "Hypothesis", title: "Framing What We'll Learn",
        story: "Assumptions transform into testable, falsifiable hypotheses that define what success looks like before a single pixel is designed.",
        outcome: "Measurable hypotheses tied to outcome metrics.",
        skills: ["#HypothesisDesign", "#OutcomeDriven", "#MetricDefinition", "#JobsToBeDone", "#LearningGoals"],
      },
      {
        id: "mvp", num: "03", tab: "MVP", title: "Defining the Minimum That Matters",
        story: "Ruthless scoping identifies the smallest version of the experience that will generate the learning needed to move forward confidently.",
        outcome: "Focused MVP scope with clear success criteria.",
        skills: ["#MVPScoping", "#CoreFeatures", "#ValueProposition", "#RapidPrototyping", "#FocusDesign"],
      },
      {
        id: "experiment", num: "04", tab: "Experiment", title: "Building to Learn",
        story: "Lightweight experiments — not finished products — are built and released quickly. The goal is learning, not perfection.",
        outcome: "Real-world feedback data from a live experiment.",
        skills: ["#Experimentation", "#SplitTesting", "#RapidIteration", "#PrototypeFirst", "#BuildMeasureLearn"],
      },
      {
        id: "validate-lean", num: "05", tab: "Validate", title: "Deciding What the Data Says",
        story: "Evidence from experiments is synthesised honestly. Teams decide whether to pivot, persevere, or stop — based on data, not opinion.",
        outcome: "A clear pivot or persevere decision with rationale.",
        skills: ["#DataDriven", "#FeedbackSynthesis", "#PivotOrPersevere", "#UserValidation", "#LearningLoops"],
      },
      {
        id: "learn", num: "06", tab: "Learn", title: "Making Learning Stick",
        story: "Insights are documented, shared, and fed back into the next cycle. Every iteration makes the team smarter and the product sharper.",
        outcome: "Captured knowledge and a sharper next hypothesis.",
        skills: ["#KnowledgeCapture", "#TeamAlignment", "#ContinuousImprovement", "#InformedIteration", "#DesignDebt"],
      },
    ],
  },
];

/* ─────────────────────────────────────────────────────────────
   Scattered hashtag positions (5 slots, stable per index)
───────────────────────────────────────────────────────────── */
const SCATTER: { left?: string; right?: string; top?: string; bottom?: string; rotate: number; size: number; opacity: number }[] = [
  { left: "6%",  top: "10%",    rotate: -4,  size: 22, opacity: 1    },
  { right: "5%", top: "22%",    rotate: 3,   size: 19, opacity: 0.85 },
  { left: "28%", top: "44%",    rotate: -2,  size: 21, opacity: 0.92 },
  { left: "4%",  bottom: "22%", rotate: 5,   size: 18, opacity: 0.75 },
  { right: "6%", bottom: "16%", rotate: -3,  size: 20, opacity: 0.88 },
];

function ScatteredSkills({ skills, stepId }: { skills: string[]; stepId: string }) {
  return (
    <div className="relative w-full h-full">
      {skills.slice(0, 5).map((skill, i) => {
        const pos = SCATTER[i];
        return (
          <motion.div
            key={`${stepId}-${skill}`}
            className="absolute"
            style={{
              left: pos.left,
              right: pos.right,
              top: pos.top,
              bottom: pos.bottom,
              rotate: pos.rotate,
            }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: pos.opacity, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: 0.08 + i * 0.09, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              style={{
                fontFamily: "Fraunces, serif",
                fontStyle: "italic",
                fontWeight: 700,
                fontSize: pos.size,
                color: "rgba(255,255,255,0.92)",
                letterSpacing: "-0.01em",
                whiteSpace: "nowrap",
                display: "block",
              }}
            >
              <span style={{ color: ACCENT }}>#</span>
              {skill.slice(1)}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main component
───────────────────────────────────────────────────────────── */
const FW_IDS: FwId[] = ["ai", "standard", "lean"];

export function Process() {
  const [fwId, setFwId]     = useState<FwId>("ai");
  const [active, setActive] = useState(0);
  const ref    = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const fw   = frameworks.find(f => f.id === fwId)!;
  const step = fw.steps[active];

  const handleFwChange = (id: FwId) => {
    setFwId(id);
    setActive(0);
  };

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-t border-white/[0.06]"
      style={{ background: "#0A0A0F", paddingBlock: "clamp(4rem, 8vw, 8rem)" }}
    >
      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.045, backgroundImage: "linear-gradient(to right,rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize: "64px 64px" }} />
      {/* Orbs */}
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full pointer-events-none blur-[140px]"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none blur-[100px]"
        style={{ background: "radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%)" }} />

      <div className="relative max-w-[1280px] mx-auto px-6 md:px-10">

        {/* ── Header row: left = title + pills, right = step tabs ── */}
        <div className="mb-14 flex flex-col lg:flex-row lg:items-end gap-10 lg:gap-16">

          {/* Left — section header + methodology pills */}
          <div className="flex-shrink-0 lg:max-w-[420px]">
            <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
              className="mb-5 text-[11px] uppercase tracking-[0.22em]"
              style={{ color: "rgba(167,139,250,0.7)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 600 }}>
              Design Process
            </motion.p>
            <motion.h2 initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
              className="text-[clamp(2.6rem,5vw,4.2rem)] leading-[1.04] tracking-[-0.03em] text-white"
              style={{ fontFamily: "Fraunces, serif", fontWeight: 400 }}>
              A process built for{" "}
              <em style={{ fontStyle: "italic", color: "rgba(167,139,250,0.85)" }}>complexity.</em>
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.22 }}
              className="mt-5 text-[15px] leading-[1.75]"
              style={{ color: "rgba(255,255,255,0.45)", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              Combining human insight, enterprise thinking, and AI-powered exploration to transform ambiguity into measurable outcomes.
            </motion.p>

            {/* Methodology pills */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.26 }} className="mt-8">
              <div className="inline-flex rounded-2xl p-1.5 gap-1"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                {frameworks.map(f => (
                  <button key={f.id} onClick={() => handleFwChange(f.id)}
                    className="relative px-4 py-2 rounded-xl text-[13px] outline-none transition-colors duration-300"
                    style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 500, color: fwId === f.id ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.38)" }}>
                    {fwId === f.id && (
                      <motion.span
                        layoutId="fw-pill"
                        className="absolute inset-0 rounded-xl"
                        initial={false}
                        style={{ background: "rgba(167,139,250,0.18)", border: "1px solid rgba(167,139,250,0.30)" }}
                        transition={{ type: "spring", stiffness: 400, damping: 36 }}
                      />
                    )}
                    <span className="relative">{f.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right — stage tab bar */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div key={fwId}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                <div className="flex flex-wrap gap-x-0 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                  {fw.steps.map((s, i) => (
                    <button
                      key={s.id}
                      onClick={() => setActive(i)}
                      className={`relative group text-left transition-colors duration-300 pl-[0px] pr-[40px] pt-[0px] pb-[16px] ${i === 0 ? "ml-auto" : "ml-[2px]"} mr-[0px] my-[0px]`}
                    >
                      <span className="block text-[9.5px] uppercase tracking-[0.2em] mb-1 transition-colors duration-300"
                        style={{ color: i === active ? ACCENT : "rgba(255,255,255,0.25)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 700 }}>
                        {s.num}
                      </span>
                      <span className="block text-[13px] transition-colors duration-300"
                        style={{ color: i === active ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.32)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: i === active ? 600 : 400 }}>
                        {s.tab}
                      </span>
                      {i === active && (
                        <motion.div
                          layoutId={`tab-indicator-${fwId}`}
                          className="absolute bottom-0 left-0"
                          style={{ right: "1.5rem", height: "1.5px", background: "rgba(255,255,255,1)", borderRadius: "2px" }}
                          transition={{ type: "spring", stiffness: 380, damping: 34 }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── Active card (full width below the header row) ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${fwId}-${step.id}`}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-16 lg:gap-24"
            style={{ minHeight: "380px" }}
          >
                {/* Left — story */}
                <div className="flex flex-col justify-center">
                  <motion.div
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="flex items-center gap-3 mb-5">
                      <span className="text-[10px] uppercase tracking-[0.2em]"
                        style={{ color: ACCENT, fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 700 }}>
                        {step.num}
                      </span>
                      <span className="block w-8 h-px" style={{ background: "rgba(167,139,250,0.35)" }} />
                      <span className="text-[10px] uppercase tracking-[0.15em]"
                        style={{ color: "rgba(255,255,255,0.25)", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                        {step.tab}
                      </span>
                    </div>

                    <h3 className="text-[clamp(1.8rem,3vw,2.8rem)] leading-[1.1] tracking-[-0.025em] text-white mb-6"
                      style={{ fontFamily: "Fraunces, serif", fontWeight: 400 }}>
                      {step.title}
                    </h3>

                    <p className="text-[15px] leading-[1.8] mb-10"
                      style={{ color: "rgba(255,255,255,0.50)", fontFamily: "Plus Jakarta Sans, sans-serif", maxWidth: "480px" }}>
                      {step.story}
                    </p>

                    {/* Outcome */}
                    <div className="flex items-start gap-4">
                      <div className="w-[2px] self-stretch rounded-full shrink-0 mt-1"
                        style={{ background: "rgba(167,139,250,0.5)" }} />
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.18em] mb-2"
                          style={{ color: "rgba(255,255,255,0.28)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 600 }}>
                          Outcome
                        </p>
                        <p className="text-[16px] leading-[1.5]"
                          style={{ color: "rgba(255,255,255,0.80)", fontFamily: "Fraunces, serif", fontStyle: "italic" }}>
                          {step.outcome}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Right — scattered hashtags */}
                <motion.div
                  className="flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.18, duration: 0.5 }}
                >
                  <div className="relative w-full rounded-2xl overflow-hidden"
                    style={{
                      height: "340px",
                      background: "rgba(255,255,255,0.018)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                    }}
                  >
                    {/* Subtle inner glow */}
                    <div className="absolute inset-0 pointer-events-none"
                      style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(167,139,250,0.06), transparent 70%)" }} />

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${fwId}-${step.id}-skills`}
                        className="absolute inset-0 p-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <ScatteredSkills skills={step.skills} stepId={`${fwId}-${step.id}`} />
                      </motion.div>
                    </AnimatePresence>

                    {/* Corner vignette */}
                    <div className="absolute inset-0 pointer-events-none rounded-2xl"
                      style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(10,10,15,0.55) 100%)" }} />
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>

        {/* ── Step dots ── */}
        <div className="mt-10 flex items-center gap-2">
          {fw.steps.map((_, i) => (
            <button key={i} onClick={() => setActive(i)}
              className="transition-all duration-300"
              style={{ width: i === active ? 24 : 6, height: 6, borderRadius: 3, background: i === active ? ACCENT : "rgba(255,255,255,0.18)" }}
              aria-label={`Go to step ${i + 1}`}
            />
          ))}
        </div>

        {/* ── Final statement + editable logo grid ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-28 md:mt-36 pt-16 border-t"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="flex flex-col items-start text-left gap-4">
              {/* Handwriting lead-in */}
              <span
                style={{
                  fontFamily: "'Caveat', cursive",
                  fontSize: "clamp(3.1rem, 2vw, 1.45rem)",
                  color: "rgba(167,139,250,0.9)",
                  letterSpacing: "0.01em",
                  lineHeight: 1.2,
                  transform: "rotate(-1.5deg)",
                  display: "inline-block",
                  marginBottom: "-4px",
                }}
              >
                I <span style={{ color: "rgba(167,139,250,1)", fontWeight: 700 }}>believe in</span>
              </span>

              <div className="flex flex-wrap items-center justify-start gap-4 md:gap-8">
                <span className="text-[clamp(1.3rem,2.4vw,1.9rem)] tracking-[-0.01em]"
                  style={{ color: "rgba(255,255,255,0.85)", fontFamily: "Fraunces, serif", fontWeight: 300 }}>
                  Human Insight
                </span>
                <span className="text-[1.4rem] text-[32px]"
                  style={{ color: "rgba(255,255,255,0.85)", fontFamily: "Fraunces, serif" }}>
                  ×
                </span>
                <span className="text-[clamp(1.3rem,2.4vw,1.9rem)] tracking-[-0.01em]"
                  style={{ color: "rgba(255,255,255,0.85)", fontFamily: "Fraunces, serif", fontWeight: 300 }}>
                  AI Intelligence
                </span>
              </div>
              <div className="w-full max-w-[500px] h-px"
                style={{ background: "linear-gradient(90deg, rgba(167,139,250,0.4), rgba(167,139,250,0.12), transparent)" }} />
              <span className="text-[clamp(2.4rem,5.6vw,4.8rem)] leading-[1.02] tracking-[-0.03em]"
                style={{ color: "rgba(255,255,255,1)", fontFamily: "Fraunces, serif", fontStyle: "italic", fontWeight: 400 }}>
                Meaningful Impact
              </span>
            </div>

            <div className="w-full scale-[1.25] origin-center">
              <ToolsGrid />
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
