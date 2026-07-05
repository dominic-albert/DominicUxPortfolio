import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Linkedin, Mail, FileText, ArrowUpRight, MapPin, Copy, Check } from "lucide-react";
import { EditableText } from "./EditableText";
import { useEdit } from "./EditContext";
import avatarSrc from "@/imports/ladder_avatar.png";

export function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { content } = useEdit();
  const [copyState, setCopyState] = useState<string | null>(null);

  const contactInfo = content.contactInfo || {
    email: "dominic.intel@gmail.com",
    linkedin: "https://www.linkedin.com/in/dominic-albert/",
    resumeLink: "#",
  };

  const handleCopy = (e: React.MouseEvent, text: string, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopyState(id);
    setTimeout(() => setCopyState(null), 2000);
  };

  const contactActions = [
    {
      id: "email",
      Icon: Mail,
      label: "Send an email",
      detail: contactInfo.email,
      href: `mailto:${contactInfo.email}`,
      cta: "Email me",
      canCopy: true,
    },
    {
      id: "linkedin",
      Icon: Linkedin,
      label: "Connect on LinkedIn",
      detail: contactInfo.linkedin.replace(/^https?:\/\//, ""),
      href: contactInfo.linkedin,
      cta: "View profile",
      canCopy: true,
    },
    {
      id: "resume",
      Icon: FileText,
      label: "Download resume",
      detail: "PDF · Updated June 2026",
      href: contactInfo.resumeLink,
      cta: "Download",
      canCopy: false,
    },
  ];

  return (
    <section id="contact" className="py-16 md:py-36 bg-card border-t border-border">
      <div className="max-w-[1320px] mx-auto px-6 md:px-10">
        <div ref={ref} className="grid lg:grid-cols-[1fr_1fr] gap-12 md:gap-24 items-start m-[0px]">

          {/* Left — headline + context */}
          <div className="space-y-8">
            {/* Avatar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block"
            >
              <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-accent/20 ring-offset-2 ring-offset-card shadow-lg">
                <img src={avatarSrc} alt="Dominic" className="w-full h-full object-cover" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <EditableText
                contentKey="contact:heading"
                defaultValue="Get in Touch"
                as="p"
                className="text-[11px] uppercase tracking-[0.12em] text-accent mb-5"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 600 }}
              />
              <EditableText
                contentKey="contact:title"
                defaultValue={`Open to the right role. Let's talk.`}
                as="h2"
                multiline
                className="text-[clamp(2.8rem,5.5vw,4.5rem)] leading-[1.05] tracking-[-0.03em] text-foreground mb-6"
                style={{ fontFamily: "Fraunces, serif", fontWeight: 400 }}
              />
              <EditableText
                contentKey="contact:description"
                defaultValue="I'm exploring Senior/Lead Product Designer, Principal Designer, and Design Manager opportunities — particularly in healthcare, fintech, or complex enterprise products where design has real impact."
                as="p"
                multiline
                className="text-[16px] text-muted-foreground leading-[1.75] max-w-[440px]"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 400 }}
              />
            </motion.div>

            {/* Availability badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full border border-border bg-secondary/40"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <EditableText
                contentKey="contact:availability"
                defaultValue="Available from August 2026"
                as="span"
                className="text-[13px] text-foreground"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 500 }}
              />
            </motion.div>

            {/* Location */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center gap-2 text-muted-foreground"
            >
              <MapPin size={14} />
              <EditableText
                contentKey="contact:location"
                defaultValue="San Francisco, CA · Open to remote"
                as="span"
                className="text-[13px]"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              />
            </motion.div>
          </div>

          {/* Right — contact actions */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="m-[0px] px-[0px] pt-[94px] pb-[0px]"
          >
            {contactActions.map(({ id, Icon, label, detail, href, cta, canCopy }, i) => (
              <motion.a
                key={id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 16 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.2 + i * 0.1 }}
                whileHover={{ y: -3, scale: 1.01 }}
                className="group liquid-glass liquid-sheen liquid-glow flex items-center gap-5 p-5 rounded-2xl transition-all duration-300 mx-[0px] mt-[0px] mb-[40px]"
              >
                {/* Icon */}
                <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center shrink-0 group-hover:bg-accent/10 transition-colors duration-300">
                  <Icon size={18} className="text-foreground group-hover:text-accent transition-colors duration-300" strokeWidth={1.8} />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p
                      className="text-[13px] text-muted-foreground"
                      style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 500 }}
                    >
                      {label}
                    </p>
                    {canCopy && (
                      <button
                        onClick={(e) => handleCopy(e, id === "email" ? contactInfo.email : contactInfo.linkedin, id)}
                        className="p-1 hover:bg-accent/10 rounded transition-colors text-muted-foreground hover:text-accent"
                        title="Copy to clipboard"
                      >
                        {copyState === id ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                      </button>
                    )}
                  </div>
                  <p
                    className="text-[15px] text-foreground truncate"
                    style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 600 }}
                  >
                    {detail}
                  </p>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className="text-[12px] text-muted-foreground group-hover:text-accent transition-colors duration-200 hidden sm:block"
                    style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 600 }}
                  >
                    {cta}
                  </span>
                  <div className="w-7 h-7 rounded-full border border-border group-hover:border-accent group-hover:bg-accent group-hover:text-white flex items-center justify-center transition-all duration-300">
                    <ArrowUpRight size={13} className="group-hover:text-white transition-colors" />
                  </div>
                </div>
              </motion.a>
            ))}

            {/* Response time note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6 }}
              className="text-[12px] text-muted-foreground pt-2 px-1"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              I typically respond within 1–2 business days. I look forward to hearing from you.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
