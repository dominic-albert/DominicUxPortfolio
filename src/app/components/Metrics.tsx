import { useRef, useState, useEffect } from "react";
import { motion, useInView, animate } from "motion/react";
import { EditableText } from "./EditableText";
import { useEdit } from "./EditContext";

const stats = [
  {
    value: "9+",
    label: "Years of Practice",
    sub: "Senior-level product design across regulated and consumer industries",
  },
  {
    value: "20+",
    label: "Enterprise Clients",
    sub: "Delivered solutions for Healthcare, FinTech, and SaaS organisations",
  },
  {
    value: "42%",
    label: "Drop-off Reduction",
    sub: "Patient scheduling redesign across a 40-hospital network",
  },
  {
    value: "$2.1B",
    label: "AUM Migrated",
    sub: "Wealth management platform redesign, 94% client retention",
  },
  {
    value: "6",
    label: "NHS Trusts",
    sub: "Service design system deployed across emergency care pathways",
  },
  {
    value: "250+",
    label: "Research Sessions",
    sub: "User interviews, usability tests, and ethnographic studies conducted",
  },
];

// Split a value like "$2.1B" → { prefix:"$", target:2.1, suffix:"B", decimals:1 }
function parseValue(value: string) {
  const m = value.match(/^([^\d-]*)(-?[\d,]*\.?\d+)(.*)$/);
  if (!m) return { prefix: "", target: 0, suffix: value, decimals: 0, ok: false };
  const numStr = m[2].replace(/,/g, "");
  const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;
  return {
    prefix: m[1],
    target: parseFloat(numStr),
    suffix: m[3],
    decimals,
    ok: true,
  };
}

const formatNum = (v: number, decimals: number) =>
  v.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

/** Counts up from 0 to the value when scrolled into view, then stops. */
function CountUp({
  value,
  inView,
  delay,
}: {
  value: string;
  inView: boolean;
  delay: number;
}) {
  const { prefix, target, suffix, decimals, ok } = parseValue(value);
  const [display, setDisplay] = useState(ok ? formatNum(0, decimals) : value);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current || !ok) return;
    started.current = true;
    const controls = animate(0, target, {
      duration: 1.8,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(formatNum(v, decimals)),
    });
    return () => controls.stop();
  }, [inView, ok, target, decimals, delay]);

  if (!ok) return <>{value}</>;
  return (
    <>
      {prefix}
      {display}
      {suffix}
    </>
  );
}

function MetricValue({
  i,
  fallback,
  inView,
  delay,
}: {
  i: number;
  fallback: string;
  inView: boolean;
  delay: number;
}) {
  const { isEditMode, content } = useEdit();
  const valueClass =
    "text-[clamp(3rem,5vw,5rem)] leading-none tracking-[-0.04em] text-foreground relative tabular-nums";
  const valueStyle = { fontFamily: "Fraunces, serif", fontWeight: 300 } as const;

  if (isEditMode) {
    return (
      <EditableText
        contentKey={`metric:${i}:value`}
        defaultValue={fallback}
        as="p"
        className={valueClass}
        style={valueStyle}
      />
    );
  }

  return (
    <p className={valueClass} style={valueStyle}>
      <CountUp
        value={content[`metric:${i}:value`] || fallback}
        inView={inView}
        delay={delay}
      />
    </p>
  );
}

export function Metrics() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-16 md:py-36 bg-background border-t border-b border-border">
      <div className="max-w-[1320px] mx-auto px-6 md:px-10">
        {/* Header */}
        <div ref={ref} className="mb-12 md:mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              className="text-[11px] uppercase tracking-[0.12em] text-accent mb-4"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 600 }}
            >
              <EditableText
                contentKey="metrics:heading"
                defaultValue="Impact by the Numbers"
                as="span"
              />
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] tracking-[-0.03em] max-w-[560px] text-foreground"
              style={{ fontFamily: "Fraunces, serif", fontWeight: 400 }}
            >
              <EditableText
                contentKey="metrics:title"
                defaultValue="Design that moves business."
                as="span"
              />
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[14px] text-muted-foreground max-w-[320px] leading-relaxed"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            <EditableText
              contentKey="metrics:description"
              defaultValue="Real outcomes from shipped products — not estimates, not projections."
              as="span"
              multiline
            />
          </motion.p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 divide-border">
          {stats.map((stat, i) => {
            const col = i % 3;
            const row = Math.floor(i / 3);
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.08 + i * 0.07 }}
                className={[
                  "group relative py-10 px-8 flex flex-col gap-3",
                  // Right border on non-last-in-row items (3-col)
                  col < 2 ? "lg:border-r lg:border-border" : "",
                  col < 1 ? "sm:border-r sm:border-border" : "",
                  // Bottom border on first row (2 rows × 3 cols)
                  row === 0 ? "lg:border-b lg:border-border" : "",
                  row === 0 ? "sm:border-b sm:border-border" : "",
                ].join(" ")}
              >
                {/* Subtle hover surface */}
                <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/[0.03] transition-colors duration-300 rounded-2xl" />

                <MetricValue
                  i={i}
                  fallback={stat.value}
                  inView={inView}
                  delay={0.15 + i * 0.12}
                />

                <div className="relative space-y-1">
                  <EditableText
                    contentKey={`metric:${i}:label`}
                    defaultValue={stat.label}
                    as="p"
                    className="text-[15px] text-foreground leading-snug"
                    style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 600 }}
                  />
                  <EditableText
                    contentKey={`metric:${i}:sub`}
                    defaultValue={stat.sub}
                    as="p"
                    multiline
                    className="text-[13px] text-muted-foreground leading-relaxed"
                    style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 400 }}
                  />
                </div>

                {/* Accent underline on hover */}
                <motion.div
                  className="absolute bottom-0 left-8 h-[2px] bg-accent origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{ width: "calc(100% - 4rem)" }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
