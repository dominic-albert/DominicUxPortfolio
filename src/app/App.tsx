import "../styles/fonts.css";
import favicon from "../imports/fav.svg";
import { useEffect, useState } from "react";
import { ThemeProvider } from "./components/ThemeContext";
import { EditProvider } from "./components/EditContext";
import { useEdit } from "./components/EditContext";
import { Preloader } from "./components/Preloader";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { LogoCarousel } from "./components/LogoCarousel";
import { FeaturedWork } from "./components/FeaturedWork";
import { About } from "./components/About";
import { Timeline } from "./components/Timeline";
import { Process } from "./components/Process";
import { Testimonials } from "./components/Testimonials";
import { Metrics } from "./components/Metrics";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { FloatingToolbar } from "./components/FloatingToolbar";
import { ContentManager } from "./components/ContentManager";
import { MouseFollower } from "./components/MouseFollower";
import { InsideTheDesignMind } from "./components/InsideTheDesignMind";
import { TreatDispenser } from "./components/TreatDispenser";

const LOADER_DURATION_MS = 2000;

/* Lives inside EditProvider so it can read context */
function AppShell() {
  const [preloaderVisible, setPreloaderVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
  let link = document.querySelector(
    "link[rel*='icon']"
  ) as HTMLLinkElement | null;

  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }

  link.type = "image/svg+xml";
  link.href = favicon;
}, []);

  

  // Animate progress 0→100 over exactly 2s, then wait 0.5s, then show page.
  useEffect(() => {
    const start = Date.now();
    let done = false;
    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.floor((elapsed / LOADER_DURATION_MS) * 100));
      setProgress(pct);
      if (pct >= 100 && !done) {
        done = true;
        clearInterval(tick);
        setTimeout(() => setPreloaderVisible(false), 500);
      }
    }, 16);
    return () => clearInterval(tick);
  }, []);

  return (
    <>
      <Preloader progress={progress} visible={preloaderVisible} />

      <div
        className="min-h-screen bg-background text-foreground antialiased"
        style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
      >
        <style>{`
          ::-webkit-scrollbar { display: none; }
          * { scrollbar-width: none; }
          html { scroll-behavior: smooth; }
        `}</style>
        <Header />
        <main>
          <Hero />
          <LogoCarousel />
          <FeaturedWork />
          <About />
          <Metrics />
          <Timeline />
          <Process />
          <InsideTheDesignMind />
          <Testimonials />
          <TreatDispenser />
          <Contact />
        </main>
        <Footer />
        <FloatingToolbar />
        <ContentManager />
        <MouseFollower />
      </div>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <EditProvider>
        <AppShell />
      </EditProvider>
    </ThemeProvider>
  );
}

