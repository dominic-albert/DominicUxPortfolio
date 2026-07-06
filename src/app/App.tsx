import "../styles/fonts.css";
import favicon from "../imports/fav.svg";
import { useEffect, useRef, useState } from "react";
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

const MIN_DISPLAY_MS = 1800;

function preloadImages(urls: string[], onProgress: (pct: number) => void): Promise<void> {
  const valid = urls.filter(Boolean);
  if (valid.length === 0) { onProgress(100); return Promise.resolve(); }
  let done = 0;
  return Promise.all(
    valid.map(
      url =>
        new Promise<void>(resolve => {
          const img = new window.Image();
          img.onload = img.onerror = () => {
            done++;
            onProgress(Math.round((done / valid.length) * 100));
            resolve();
          };
          img.src = url;
        })
    )
  ).then(() => {});
}

/* Lives inside EditProvider so it can read context */
function AppShell() {
  const { projects, content, isLoading } = useEdit();
  const [preloaderVisible, setPreloaderVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const startRef = useRef(Date.now());
  const startedRef = useRef(false);
  
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

  

  // Simulated ticker: crawls 0 → 75 while Supabase fetches / images load,
  // so the bar is always visibly moving from the first frame.
  useEffect(() => {
    const tick = setInterval(() => {
      setProgress(p => {
        if (p >= 75) { clearInterval(tick); return p; }
        // Slow down as it approaches 75 (eases naturally)
        return p + Math.max(0.4, (75 - p) * 0.045);
      });
    }, 80);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    if (isLoading || startedRef.current) return;
    startedRef.current = true;

    const urls: string[] = [
      ...projects.map((p: any) => p.thumbnail),
      ...(content.collagePhotos ?? []).map((p: any) => p.src),
    ];

    preloadImages(urls, pct => {
      // Map image progress (0–100) into the remaining 75–100 range
      setProgress(75 + Math.round(pct * 0.25));
    }).then(() => {
      setProgress(100);
      const elapsed = Date.now() - startRef.current;
      const wait = Math.max(0, MIN_DISPLAY_MS - elapsed);
      setTimeout(() => setPreloaderVisible(false), wait);
    });
  }, [isLoading]);

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

