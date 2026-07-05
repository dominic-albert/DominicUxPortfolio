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

        <svg width="955" height="955" viewBox="0 0 955 955" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="955" height="955" fill="url(#paint0_linear_27_1891)"/>
<path d="M511.785 89C562.935 89 614.085 89 666.785 89C666.805 148.633 666.805 148.633 666.81 167.313C666.81 167.973 666.811 168.633 666.811 169.313C666.817 191.539 666.823 213.764 666.827 235.989C666.827 236.714 666.827 237.44 666.827 238.187C666.83 253.955 666.833 269.723 666.836 285.491C666.837 293.224 666.838 300.957 666.84 308.69C666.84 309.844 666.84 309.844 666.84 311.022C666.844 335.951 666.852 360.88 666.861 385.809C666.87 411.433 666.876 437.057 666.878 462.681C666.879 466.303 666.879 469.924 666.879 473.546C666.88 474.259 666.88 474.971 666.88 475.706C666.881 487.166 666.885 498.626 666.891 510.086C666.897 521.616 666.899 533.145 666.898 544.675C666.897 550.918 666.898 557.162 666.904 563.405C666.909 569.126 666.909 574.847 666.905 580.568C666.905 582.633 666.906 584.698 666.909 586.763C666.932 602.637 666.328 617.941 663.285 633.562C663.157 634.222 663.028 634.882 662.897 635.561C654.869 676.4 638.274 716.886 612.785 750C612.202 750.763 611.619 751.526 611.019 752.312C609.29 754.555 607.539 756.778 605.785 759C605.193 759.767 604.601 760.534 603.992 761.324C592.002 776.676 578.151 791.029 562.785 803C561.789 803.789 560.794 804.578 559.769 805.391C519.415 837.16 470.941 858.712 419.785 865C418.98 865.103 418.176 865.206 417.347 865.312C357.716 872.674 298.826 860.662 245.785 833C231.262 825.191 217.708 816.233 204.785 806C204.161 805.507 203.538 805.013 202.896 804.505C185.947 790.869 168.596 774.502 155.993 756.705C154.652 754.812 153.275 752.948 151.898 751.082C133.253 725.555 119.818 697.928 109.785 668C109.433 666.968 109.081 665.936 108.718 664.872C104.382 652.067 101.697 639.221 99.5971 625.875C99.4301 624.827 99.2632 623.78 99.0912 622.701C90.6645 566.843 99.5569 507.547 124.66 456.938C128.443 449.476 132.48 442.174 136.785 435C137.434 433.911 137.434 433.911 138.097 432.8C144.449 422.224 151.301 412.454 159.265 403.027C161.729 400.301 161.729 400.301 162.785 398C163.445 398 164.105 398 164.785 398C165.014 397.453 165.243 396.907 165.48 396.344C172.415 383.886 187.042 371.891 198.109 363.125C199.825 361.762 201.518 360.368 203.179 358.938C238.2 328.935 283.499 309.628 328.41 300.812C329.196 300.657 329.982 300.502 330.791 300.343C347.563 297.221 364.067 296.595 381.097 296.625C382.249 296.626 383.402 296.626 384.589 296.627C402.025 296.664 418.683 297.382 435.785 301C436.883 301.22 437.98 301.439 439.112 301.666C464.409 306.776 488.693 315.454 511.785 327C511.785 248.46 511.785 169.92 511.785 89Z" fill="#FBFEFE"/>
<circle cx="381.5" cy="590.5" r="125.5" fill="#593DB2"/>
<ellipse cx="797.5" cy="779.5" rx="84.5" ry="87.5" fill="white"/>
<defs>
<linearGradient id="paint0_linear_27_1891" x1="477" y1="-101" x2="477.5" y2="955" gradientUnits="userSpaceOnUse">
<stop stop-color="#8C67FF"/>
<stop offset="1" stop-color="#2B1C58"/>
</linearGradient>
</defs>
</svg>

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
