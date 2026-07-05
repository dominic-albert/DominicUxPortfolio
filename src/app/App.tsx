import "../styles/fonts.css";
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
    // Inject favicon dynamically (works with Figma Make)
  useEffect(() => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <defs>
          <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#A259FF"/>
            <stop offset="100%" stop-color="#6B2FFF"/>
          </linearGradient>
        </defs>

        <rect width="64" height="64" rx="14" fill="url(#g)"/>

        <text
          x="50%"
          y="54%"
          text-anchor="middle"
          dominant-baseline="middle"
          font-family="Inter, Arial, sans-serif"
          font-size="42"
          font-weight="700"
          fill="white">
          d
        </text>
      </svg>
    `;

    let link = document.querySelector(
      "link[rel*='icon']"
    ) as HTMLLinkElement | null;

    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }

    link.type = "image/svg+xml";
    link.href =
      "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
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
