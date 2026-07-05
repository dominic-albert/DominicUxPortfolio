import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Quote, BadgeCheck } from "lucide-react";
import { EditableText } from "./EditableText";
import { EditableImage } from "./EditableImage";
import { useEdit } from "./EditContext";

// Subtle fractal-noise "paper grain" overlay (data-URI SVG)
const paperGrain =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 220 220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

// Unique, consistent-style illustrated avatars (DiceBear avataaars).
// `opts` encodes gender-specific features so each person reads correctly.
const avatarUrl = (seed: string, opts: string) =>
  `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(
    seed,
  )}&backgroundColor=transparent&${opts}`;

const testimonials = [
  {
    id: 1,
    name: "Dr. Sarah Mitchell",
    title: "Chief Digital Officer · Healthify",
    headline: "Strategic & Visionary",
    avatar: avatarUrl(
      "Sarah Mitchell",
      "top=straight02&accessories=prescription02&accessoriesProbability=100&facialHairProbability=0&hairColor=4a312c&skinColor=edb98a",
    ),
    quote:
      "Dominic doesn't just design interfaces — she redesigns how organizations think about their users. Her work on our patient platform wasn't just beautiful; it measurably improved clinical outcomes and reduced administrative burden for nurses and physicians alike.",
  },
  {
    id: 2,
    name: "James Okonkwo",
    title: "VP of Product · Clearbank",
    headline: "Detail & Big Picture",
    avatar: avatarUrl(
      "James Okonkwo",
      "top=shortFlat&facialHair=beardMedium&facialHairProbability=100&hairColor=2c1b18&skinColor=614335",
    ),
    quote:
      "What sets Dominic apart is the ability to operate at both levels simultaneously — the 10,000-foot strategic view and the pixel-level detail. He united our compliance, advisory, and engineering teams around a shared design vision.",
  },
  {
    id: 3,
    name: "Emma Lichtenstein",
    title: "Head of UX Research · SAP",
    headline: "Listens & Delivers",
    avatar: avatarUrl(
      "Emma Lichtenstein",
      "top=curly&accessoriesProbability=0&facialHairProbability=0&hairColor=a55728&skinColor=ffdbb4",
    ),
    quote:
      "Dominic is the rare designer who genuinely listens to research and translates it into decisions that scale. He facilitates cross-functional workshops and builds consensus without ever losing design integrity. Working with him elevated our entire team.",
  },
  {
    id: 4,
    name: "Ravi Patel",
    title: "Engineering Lead · Healthify",
    headline: "Rare & Reliable",
    avatar: avatarUrl(
      "Ravi Patel",
      "top=shortWaved&facialHair=moustacheFancy&facialHairProbability=100&hairColor=2c1b18&skinColor=d08b5b",
    ),
    quote:
      "As an engineer, I've worked with many designers. Dominic is the one who consistently made our jobs easier — not harder. His specs were meticulous, his accessibility requirements well-reasoned, and he understood the technical tradeoffs.",
  },
];

// Subtle decorative line-art for a card corner — one motif per card.
function LineArt({ variant }: { variant: number }) {
  const cls =
    "absolute -bottom-6 -right-6 w-28 h-28 text-accent/15 group-hover/card:text-accent/35 transition-colors duration-500 pointer-events-none";
  const common = {
    viewBox: "0 0 100 100",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    className: cls,
  };
  const arts = [
    // Concentric arcs
    <svg {...common} key="0">
      <path d="M100 26 A74 74 0 0 0 26 100" />
      <path d="M100 48 A52 52 0 0 0 48 100" />
      <path d="M100 70 A30 30 0 0 0 70 100" />
    </svg>,
    // Dotted grid
    <svg {...common} key="1">
      {[30, 48, 66, 84].map((y) =>
        [30, 48, 66, 84].map((x) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" fill="currentColor" stroke="none" />
        )),
      )}
    </svg>,
    // Stacked waves
    <svg {...common} key="2">
      {[40, 56, 72, 88].map((y) => (
        <path key={y} d={`M14 ${y} Q 34 ${y - 12}, 54 ${y} T 94 ${y}`} />
      ))}
    </svg>,
    // Radiating lines from the corner
    <svg {...common} key="3">
      {[20, 36, 52, 68, 84].map((p) => (
        <line key={p} x1="98" y1="98" x2={p} y2="100" />
      ))}
      {[20, 36, 52, 68, 84].map((p) => (
        <line key={`v${p}`} x1="98" y1="98" x2="100" y2={p} />
      ))}
    </svg>,
  ];
  return arts[variant % arts.length];
}

function TestimonialCard({ t, i }: { t: (typeof testimonials)[0]; i: number }) {
  return (
    <div className="group/card shrink-0 w-[300px] md:w-[340px]">
      {/* Card — all content inside including avatar */}
      <div className="relative z-0 rounded-[22px] bg-card border border-border p-6 md:p-7 flex flex-col overflow-hidden transition-all duration-500 ease-out cursor-default group-hover/card:-translate-y-2 group-hover/card:scale-[1.03] group-hover/card:shadow-2xl group-hover/card:z-20 group-hover/card:bg-card/55 group-hover/card:backdrop-blur-xl group-hover/card:border-accent/40">
        {/* Paper grain texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.5] dark:opacity-[0.16] mix-blend-soft-light"
          style={{ backgroundImage: paperGrain, backgroundSize: "200px 200px" }}
        />

        {/* Glass highlight — fades in on hover */}
        <div
          className="absolute inset-0 rounded-[22px] pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"
          style={{
            background: "radial-gradient(130% 70% at 50% 0%, rgba(255,255,255,0.22), transparent 60%)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.55), inset 0 0 0 1px rgba(255,255,255,0.08)",
          }}
        />

        {/* Top sheen line */}
        <div className="absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

        {/* Subtle corner line-art */}
        <LineArt variant={i} />

        {/* Decorative quote glyph */}
        <Quote
          className="absolute top-5 right-5 z-10 text-accent/15 transition-colors duration-500 group-hover/card:text-accent/35"
          size={46}
          strokeWidth={1.5}
          fill="currentColor"
        />

        <h3
          className="relative z-10 text-[clamp(1.15rem,1.6vw,1.4rem)] leading-[1.2] tracking-[-0.01em] text-accent mb-3"
          style={{ fontFamily: "Fraunces, serif", fontWeight: 600 }}
        >
          <EditableText
            contentKey={`testimonial:${i}:headline`}
            defaultValue={t.headline}
            as="span"
          />
        </h3>

        <EditableText
          contentKey={`testimonial:${i}:quote`}
          defaultValue={t.quote}
          as="p"
          multiline
          className="relative z-10 flex-1 text-[13px] md:text-[13.5px] leading-[1.65] text-muted-foreground line-clamp-[7]"
          style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 400 }}
        />

        {/* Separator */}
        <div className="relative z-10 my-5 h-px bg-border/60" />

        {/* Avatar + name inside the card */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="relative shrink-0">
            <div className="w-11 h-11 rounded-full overflow-hidden bg-secondary ring-2 ring-accent/30 ring-offset-2 ring-offset-card transition-shadow duration-500 group-hover/card:shadow-lg">
              <EditableImage
                contentKey={`testimonial:${i}:avatar`}
                defaultSrc={t.avatar}
                alt={t.name}
                className="w-full h-full object-cover"
              />
            </div>
            <BadgeCheck
              size={15}
              className="absolute -bottom-0.5 -right-0.5 text-accent fill-card"
            />
          </div>
          <div className="min-w-0">
            <EditableText
              contentKey={`testimonial:${i}:name`}
              defaultValue={t.name}
              as="p"
              className="text-[13px] text-foreground truncate"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 600 }}
            />
            <EditableText
              contentKey={`testimonial:${i}:title`}
              defaultValue={t.title}
              as="p"
              className="text-[11px] text-muted-foreground truncate"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { isEditMode } = useEdit();

  // Duplicate the set for a seamless infinite loop (single set while editing).
  const loop = isEditMode ? testimonials : [...testimonials, ...testimonials];

  return (
    <section
      id="testimonials"
      className="relative py-16 md:py-36 bg-card border-t border-border overflow-hidden"
    >
      {/* Ambient accent glow */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-accent/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] translate-x-1/4 translate-y-1/3 rounded-full bg-accent/[0.07] blur-[120px] pointer-events-none" />

      <div className="relative max-w-[1320px] mx-auto px-6 md:px-10">
        <div ref={ref} className="mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="flex items-center gap-3 mb-5"
          >
            <span className="h-px w-8 bg-accent" />
            <EditableText
              contentKey="testimonials:heading"
              defaultValue="Testimonials"
              as="span"
              className="text-[11px] uppercase tracking-[0.16em] text-accent"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 600 }}
            />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] tracking-[-0.03em] max-w-[560px]"
            style={{ fontFamily: "Fraunces, serif", fontWeight: 400 }}
          >
            <EditableText
              contentKey="testimonials:title"
              defaultValue="What colleagues say."
              as="span"
            />
          </motion.h2>
        </div>
      </div>

      {/* Marquee track — pauses on hover, each card pops */}
      {isEditMode ? (
        <div className="relative max-w-[1320px] mx-auto px-6 md:px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loop.map((t, i) => (
            <TestimonialCard key={t.id} t={t} i={i} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="group/track relative overflow-hidden py-10"
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
            maskImage:
              "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
          }}
        >
          <div className="flex gap-5 md:gap-6 w-max animate-testimonial-marquee">
            {loop.map((t, idx) => (
              <TestimonialCard
                key={`${t.id}-${idx}`}
                t={t}
                i={idx % testimonials.length}
              />
            ))}
          </div>
        </motion.div>
      )}
    </section>
  );
}
