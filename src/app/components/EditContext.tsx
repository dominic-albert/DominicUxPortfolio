import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { projectId, publicAnonKey } from "/utils/supabase/info.tsx";

interface EditContextType {
  isEditMode: boolean;
  isLoading: boolean;
  content: Record<string, any>;
  projects: any[];
  sections: Record<string, boolean>;
  toggleEditMode: () => void;
  updateContent: (key: string, value: any) => void;
  updateProjects: (projects: any[]) => void;
  updateSections: (sections: Record<string, boolean>) => void;
  saveChanges: () => Promise<void>;
  uploadImage: (file: File) => Promise<string>;
  hasUnsavedChanges: boolean;
}

const EditContext = createContext<EditContextType | undefined>(undefined);

const defaultProjects = [
  {
    id: "1",
    title: "Patient Journey Redesign",
    description: "Redesigned the end-to-end patient scheduling experience for a 40-hospital network, reducing friction at every touchpoint and improving accessibility compliance to WCAG 2.1 AA.",
    tags: ["Healthcare", "Lead UX Designer"],
    thumbnail: "https://images.unsplash.com/photo-1777503810475-54815aae2cb4?w=900&h=600&fit=crop&auto=format",
    caseStudyLink: "#",
    featured: true,
    outcome: "62% reduction in appointment drop-off",
    accent: "#E8F4F8",
  },
  {
    id: "2",
    title: "Wealth Management Platform",
    description: "Designed a complex wealth management dashboard for institutional clients, distilling real-time portfolio data into actionable clarity.",
    tags: ["FinTech", "Senior Product Designer"],
    thumbnail: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=540&fit=crop&auto=format",
    caseStudyLink: "#",
    featured: true,
    outcome: "$2.1B AUM migrated with 94% retention",
    accent: "#EEF0FF",
  },
];

const defaultCareers = [
  {
    id: "1",
    year: "2022 – Present",
    role: "Lead Product Designer",
    company: "Healthify",
    location: "San Francisco, CA",
    type: "Full-time",
    achievements: [
      "Led the redesign of patient engagement platform serving 2.4M users across 40 hospital systems",
      "Built and mentored a 5-person design team, establishing design culture and process",
      "Reduced patient appointment drop-off by 62% through evidence-based UX improvements",
      "Championed WCAG 2.1 AA accessibility standards across all product surfaces",
    ],
  },
  {
    id: "2",
    year: "2019 – 2022",
    role: "Senior Product Designer",
    company: "Clearbank Financial",
    location: "New York, NY",
    type: "Full-time",
    achievements: [
      "Designed wealth management dashboard for 18,000+ institutional investors managing $2.1B AUM",
      "Led cross-functional discovery with 12 stakeholders across compliance, risk, and advisory teams",
      "Established Clearbank's first design system — 60+ components adopted by 4 product teams",
      "Reduced onboarding time from 47 to 19 minutes through research-led flow simplification",
    ],
  },
];

const defaultLogos = [
  { name: "NHS England", abbr: "NHS" },
  { name: "Fidelity Investments", abbr: "Fidelity" },
  { name: "Lloyds Banking Group", abbr: "Lloyds" },
  { name: "Microsoft Health", abbr: "Microsoft" },
  { name: "Google Health", abbr: "Google" },
  { name: "McKinsey & Company", abbr: "McKinsey" },
  { name: "Kaiser Permanente", abbr: "Kaiser" },
  { name: "Healthify", abbr: "Healthify" },
  { name: "Salesforce", abbr: "Salesforce" },
  { name: "Deloitte Digital", abbr: "Deloitte" },
  { name: "HSBC", abbr: "HSBC" },
  { name: "Epic Systems", abbr: "Epic" },
];

const defaultCollagePhotos = [
  {
    id: "1",
    src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
    rotation: -6,
    left: "10%",
    top: "25%",
    width: "35%",
    zIndex: 1,
  },
  {
    id: "2",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
    rotation: 8,
    left: "52%",
    top: "30%",
    width: "35%",
    zIndex: 2,
  },
  {
    id: "3",
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=600&fit=crop",
    rotation: -4,
    left: "28%",
    top: "58%",
    width: "38%",
    zIndex: 3,
  },
];

function PasswordModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  const submit = () => {
    if (value === "Mira") {
      onConfirm();
    } else {
      setError(true);
      setValue("");
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border p-8 shadow-2xl"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
      >
        <p className="text-[15px] font-semibold mb-1" style={{ fontFamily: "Fraunces, serif", color: "var(--foreground)" }}>Enter edit mode</p>
        <p className="text-[13px] mb-5" style={{ fontFamily: "Plus Jakarta Sans, sans-serif", color: "var(--muted-foreground)" }}>Password required to access the content manager.</p>
        <input
          autoFocus
          type="password"
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(false); }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Password"
          className="w-full px-4 py-3 rounded-xl border text-[14px] outline-none mb-1"
          style={{
            background: "var(--background)",
            borderColor: error ? "#f87171" : "var(--border)",
            color: "var(--foreground)",
            fontFamily: "Plus Jakarta Sans, sans-serif",
          }}
        />
        {error && <p className="text-[12px] text-red-400 mb-3" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Incorrect password.</p>}
        <div className="flex gap-3 mt-4">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border text-[13px] transition-colors"
            style={{ borderColor: "var(--border)", color: "var(--muted-foreground)", fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            Cancel
          </button>
          <button
            onClick={submit}
            className="flex-1 px-4 py-2.5 rounded-xl text-[13px] font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--accent)", fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            Unlock
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmModal({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border p-8 shadow-2xl"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
      >
        <p className="text-[14px] mb-6" style={{ fontFamily: "Plus Jakarta Sans, sans-serif", color: "var(--foreground)" }}>{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border text-[13px] transition-colors"
            style={{ borderColor: "var(--border)", color: "var(--muted-foreground)", fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            Stay in edit mode
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl text-[13px] font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: "#ef4444", fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            Exit anyway
          </button>
        </div>
      </div>
    </div>
  );
}

export function EditProvider({ children }: { children: ReactNode }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [content, setContent] = useState<Record<string, any>>({
    careers: [],
    logos: defaultLogos,
    collagePhotos: [],
    contactInfo: {
      email: "dominic@design.co",
      linkedin: "https://linkedin.com/in/dominicdesigns",
      resumeLink: "#",
    },
  });
  const [projects, setProjects] = useState<any[]>([]);
  const [sections, setSections] = useState<Record<string, boolean>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const hasLoadedContent = useRef(false);
  const saveTimerRef = useRef<number | null>(null);
  const saveRevisionRef = useRef(0);

  const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-80528481`;

  // Load content on mount
  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async (attempt = 0) => {
    const MAX_ATTEMPTS = 4;
    try {
      const response = await fetch(`${serverUrl}/content`, {
        headers: {
          "Authorization": `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `Failed to load content: ${response.status}`);
      }

      const data = await response.json();
      const loadedContent = data.content || {};

      // Set careers from content or use defaults
      if (!loadedContent.careers || loadedContent.careers.length === 0) {
        loadedContent.careers = defaultCareers;
      }

      // Set logos from content or use defaults
      if (!loadedContent.logos || loadedContent.logos.length === 0) {
        loadedContent.logos = defaultLogos;
      }

      // Set collage photos from content or use defaults
      if (!loadedContent.collagePhotos || loadedContent.collagePhotos.length === 0) {
        loadedContent.collagePhotos = defaultCollagePhotos;
      }

      // Set contact info with defaults if not present
      if (!loadedContent.contactInfo) {
        loadedContent.contactInfo = {
          email: "dominic@design.co",
          linkedin: "https://linkedin.com/in/dominicdesigns",
          resumeLink: "#",
        };
      }

      setContent(loadedContent);
      setProjects(data.projects && data.projects.length > 0 ? data.projects : defaultProjects);
      setSections(data.sections || {});
      setHasUnsavedChanges(false);
      hasLoadedContent.current = true;
      setIsLoading(false);
    } catch (error) {
      // The Supabase edge function can be briefly unreachable on cold start / redeploy,
      // which surfaces in the browser as "TypeError: Failed to fetch". Retry with backoff
      // before giving up so a transient blip doesn't fall back to defaults.
      if (attempt < MAX_ATTEMPTS - 1) {
        const delay = 600 * 2 ** attempt; // 600ms → 1.2s → 2.4s
        const message = error instanceof Error ? error.message : String(error);
        console.warn(
          `Content load attempt ${attempt + 1}/${MAX_ATTEMPTS} failed (${message}); retrying in ${delay}ms`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        return loadContent(attempt + 1);
      }

      console.error("Error loading content after retries:", error);
      // Show defaults so the site is still usable, but do NOT mark content as loaded.
      // Leaving hasLoadedContent false keeps autosave disabled, so we never overwrite the
      // real (and possibly populated) server content with these local defaults.
      setProjects(defaultProjects);
      setContent({
        careers: defaultCareers,
        logos: defaultLogos,
        collagePhotos: defaultCollagePhotos,
        contactInfo: {
          email: "dominic@design.co",
          linkedin: "https://linkedin.com/in/dominicdesigns",
          resumeLink: "#",
        },
      });
      setIsLoading(false);
    }
  };

  const toggleEditMode = () => {
    if (isEditMode) {
      if (hasUnsavedChanges) {
        setShowExitConfirm(true);
      } else {
        setIsEditMode(false);
      }
    } else {
      setShowPasswordModal(true);
    }
  };

  const updateContent = (key: string, value: any) => {
    saveRevisionRef.current += 1;
    setContent((prev) => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const updateProjects = (newProjects: any[]) => {
    saveRevisionRef.current += 1;
    setProjects(newProjects);
    setHasUnsavedChanges(true);
  };

  const updateSections = (newSections: Record<string, boolean>) => {
    saveRevisionRef.current += 1;
    setSections(newSections);
    setHasUnsavedChanges(true);
  };

  const saveChanges = async () => {
    const revisionAtSaveStart = saveRevisionRef.current;

    if (saveTimerRef.current) {
      window.clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }

    try {
      const response = await fetch(`${serverUrl}/content`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ content, projects, sections }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save changes");
      }

      if (saveRevisionRef.current === revisionAtSaveStart) {
        setHasUnsavedChanges(false);
      }
    } catch (error) {
      console.error("Save error:", error);
      throw error;
    }
  };

  // Live-site edits should persist without relying on the user noticing the toolbar.

  useEffect(() => {
    const warnBeforeLeaving = (event: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges) return;
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", warnBeforeLeaving);
    return () => window.removeEventListener("beforeunload", warnBeforeLeaving);
  }, [hasUnsavedChanges]);

  // Convert uploaded files to compressed base64 data URLs entirely client-side.
  // This eliminates all Supabase Storage writes and serves images from the
  // content JSON instead — zero Storage Cached Egress.
  const uploadImage = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error("Failed to decode image"));
        img.onload = () => {
          const MAX = 1400;
          const scale = Math.min(1, MAX / Math.max(img.width, img.height));
          const canvas = document.createElement("canvas");
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.82));
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });

  return (
    <EditContext.Provider
      value={{
        isEditMode,
        isLoading,
        content,
        projects,
        sections,
        toggleEditMode,
        updateContent,
        updateProjects,
        updateSections,
        saveChanges,
        uploadImage,
        hasUnsavedChanges,
      }}
    >
      {children}
      {showPasswordModal && (
        <PasswordModal
          onConfirm={() => { setShowPasswordModal(false); setIsEditMode(true); }}
          onCancel={() => setShowPasswordModal(false)}
        />
      )}
      {showExitConfirm && (
        <ConfirmModal
          message="You have unsaved changes. Exit edit mode anyway?"
          onConfirm={() => { setShowExitConfirm(false); setIsEditMode(false); }}
          onCancel={() => setShowExitConfirm(false)}
        />
      )}
    </EditContext.Provider>
  );
}

const editFallback: EditContextType = {
  isEditMode: false,
  isLoading: false,
  content: { careers: [], logos: [], collagePhotos: [], contactInfo: { email: "", linkedin: "", resumeLink: "" } },
  projects: [],
  sections: {},
  toggleEditMode: () => {},
  updateContent: () => {},
  updateProjects: () => {},
  updateSections: () => {},
  saveChanges: async () => {},
  uploadImage: async () => "",
  hasUnsavedChanges: false,
};

export function useEdit() {
  const context = useContext(EditContext);
  return context ?? editFallback;
}
