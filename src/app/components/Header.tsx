import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeContext";

const navLinks = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      // Always show at the very top; hide when scrolling down, reveal when scrolling up
      if (y < 60) {
        setVisible(true);
      } else {
        setVisible(y < lastY.current);
      }
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 bg-transparent transition-all duration-500 ${
          scrolled ? "px-3 md:px-6 pt-3 md:pt-4" : "px-0 pt-0"
        }`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: visible ? 0 : "-110%", opacity: 1 }}
        transition={{ y: { duration: 0.38, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }}
      >
        <div
          className={`mx-auto flex items-center justify-between transition-all duration-500 ease-out ${
            scrolled
              ? "max-w-[1060px] px-4 md:px-6 h-14 md:h-16 rounded-full nav-frost shadow-xl"
              : "max-w-[1320px] px-6 md:px-10 h-16 md:h-20 rounded-none"
          }`}
        >
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center shadow-lg text-[#48489b]">
              <svg className="bg-[#ca101000] bg-[#ca101000]" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 2L2 7L10 12L18 7L10 2Z" fill="white" opacity="0.9"/>
                <path d="M2 13L10 18L18 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
              </svg>
            </div>
            <span
              className="text-[15px] tracking-[-0.01em] text-foreground"
              style={{ fontFamily: "Fraunces, serif", fontWeight: 600 }}
            >Dominic Albert</span>
          </button>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="text-[13px] tracking-[0.04em] uppercase text-foreground/60 hover:text-foreground transition-colors duration-200"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 500 }}
              >
                {link.label}
              </button>
            ))}

            {/* Theme toggle */}
            <motion.button
              onClick={toggle}
              whileTap={{ scale: 0.9 }}
              className="btn-glass w-9 h-9 rounded-full bg-foreground/5 border border-border flex items-center justify-center text-foreground/60 hover:text-foreground"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
                </motion.span>
              </AnimatePresence>
            </motion.button>

            <button
              onClick={() => scrollTo("#contact")}
              className="btn-glass liquid-sheen ml-1 px-5 py-2 bg-accent text-white text-[13px] tracking-[0.04em] uppercase hover:opacity-90 rounded-full transition-opacity duration-200"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 500 }}
            >
              Let's Talk
            </button>
          </nav>

          <div className="flex items-center gap-3 md:hidden">
            <motion.button
              onClick={toggle}
              whileTap={{ scale: 0.9 }}
              className="btn-glass w-8 h-8 rounded-full bg-foreground/5 border border-border flex items-center justify-center text-foreground/60"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === "light" ? <Moon size={13} /> : <Sun size={13} />}
                </motion.span>
              </AnimatePresence>
            </motion.button>
            <button
              className="p-2 -mr-2 text-foreground"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 liquid-glass-strong flex flex-col justify-center items-center gap-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {navLinks.map((link, i) => (
              <motion.button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="text-4xl text-foreground"
                style={{ fontFamily: "Fraunces, serif", fontWeight: 400 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                {link.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
