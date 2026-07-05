import React, { useState, useEffect } from "react";
import { useEdit } from "./EditContext";
import { Plus, Edit2, Trash2, GripVertical, X, Save, Briefcase, User, Link2, Image as ImageIcon, Wrench, Settings2, MousePointer2 } from "lucide-react";
import { TOOL_DEFS } from "../data/tools";
import { motion, AnimatePresence } from "motion/react";

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  thumbnail: string;
  caseStudyLink: string;
  caseStudyPassword?: string;
  featured: boolean;
  outcome?: string;
  accent?: string;
}

interface Career {
  id: string;
  year: string;
  role: string;
  company: string;
  location: string;
  type: string;
  achievements: string[];
}

interface Logo {
  name: string;
  abbr: string;
}

interface ContactInfo {
  email: string;
  linkedin: string;
  resumeLink: string;
}

// Project Editor Modal Component
function ProjectEditorModal({ project, isOpen, onClose, onSave }: any) {
  const { uploadImage } = useEdit();
  const [tagInput, setTagInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState<Project>({
    id: project?.id || Date.now().toString(),
    title: project?.title || "",
    description: project?.description || "",
    tags: project?.tags || [],
    thumbnail: project?.thumbnail || "",
    caseStudyLink: project?.caseStudyLink || "",
    caseStudyPassword: project?.caseStudyPassword || "",
    featured: project?.featured || false,
    outcome: project?.outcome || "",
    accent: project?.accent || "#F5F4F0",
  });

  useEffect(() => {
    if (project) {
      setFormData(project);
    } else {
      setFormData({
        id: Date.now().toString(),
        title: "",
        description: "",
        tags: [],
        thumbnail: "",
        caseStudyLink: "",
        caseStudyPassword: "",
        featured: false,
        outcome: "",
        accent: "#F5F4F0",
      });
    }
    setTagInput("");
  }, [project, isOpen]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    try {
      setIsUploading(true);
      const url = await uploadImage(file);
      setFormData(prev => ({ ...prev, thumbnail: url }));
    } catch (error: any) {
      console.error("Upload error:", error);
      alert(`Failed to upload image: ${error.message || 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-foreground" style={{ fontFamily: "Fraunces, serif" }}>
                  {project ? "Edit Project" : "New Project"}
                </h2>
                <button onClick={onClose} className="p-2 hover:bg-secondary rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Project Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-foreground resize-vertical"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Tags</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                      placeholder="Add a tag..."
                      className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
                    />
                    <button type="button" onClick={addTag} className="px-4 py-2 bg-secondary hover:bg-accent/10 rounded-lg transition-colors">
                      <Plus size={18} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-secondary rounded-full text-sm">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500">
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Thumbnail Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
                  />
                  {isUploading && <p className="text-sm text-muted-foreground mt-2">Uploading...</p>}
                  {formData.thumbnail && (
                    <img src={formData.thumbnail} alt="Thumbnail preview" className="mt-4 w-full h-48 object-cover rounded-lg" />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Outcome/Impact Quote</label>
                  <input
                    type="text"
                    value={formData.outcome || ""}
                    onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
                    placeholder="e.g., 62% reduction in appointment drop-off"
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Case Study Link</label>
                  <input
                    type="url"
                    value={formData.caseStudyLink}
                    onChange={(e) => setFormData({ ...formData, caseStudyLink: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Case Study Password <span className="text-xs text-muted-foreground/60 font-normal">(optional — leave blank for no lock)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.caseStudyPassword || ""}
                    onChange={(e) => setFormData({ ...formData, caseStudyPassword: e.target.value })}
                    placeholder="e.g. designreview2025"
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
                  />
                  {formData.caseStudyPassword && (
                    <p className="mt-1.5 text-[11px] text-accent/80" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                      Visitors must enter this password before the case study opens.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Background Color</label>
                  <input
                    type="color"
                    value={formData.accent || "#F5F4F0"}
                    onChange={(e) => setFormData({ ...formData, accent: e.target.value })}
                    className="w-full h-12 px-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-5 h-5 rounded border-border accent-accent"
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-foreground">Featured Project (larger card)</label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-foreground text-background rounded-lg hover:bg-accent hover:text-white transition-all font-medium"
                  >
                    <Save size={18} />
                    Save Project
                  </button>
                  <button type="button" onClick={onClose} className="px-6 py-3 border border-border rounded-lg hover:bg-secondary transition-colors font-medium">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Career Editor Modal Component
function CareerEditorModal({ career, isOpen, onClose, onSave }: any) {
  const [achievementInput, setAchievementInput] = useState("");
  const [formData, setFormData] = useState<Career>({
    id: career?.id || Date.now().toString(),
    year: career?.year || "",
    role: career?.role || "",
    company: career?.company || "",
    location: career?.location || "",
    type: career?.type || "Full-time",
    achievements: career?.achievements || [],
  });

  useEffect(() => {
    if (career) {
      setFormData(career);
    } else {
      setFormData({
        id: Date.now().toString(),
        year: "",
        role: "",
        company: "",
        location: "",
        type: "Full-time",
        achievements: [],
      });
    }
    setAchievementInput("");
  }, [career, isOpen]);

  const addAchievement = () => {
    if (achievementInput.trim()) {
      setFormData({ ...formData, achievements: [...formData.achievements, achievementInput.trim()] });
      setAchievementInput("");
    }
  };

  const removeAchievement = (index: number) => {
    setFormData({ ...formData, achievements: formData.achievements.filter((_, i) => i !== index) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-foreground" style={{ fontFamily: "Fraunces, serif" }}>
                  {career ? "Edit Career Entry" : "New Career Entry"}
                </h2>
                <button onClick={onClose} className="p-2 hover:bg-secondary rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Year/Period</label>
                    <input
                      type="text"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      placeholder="e.g., 2022 – Present"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Employment Type</label>
                    <input
                      type="text"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      placeholder="e.g., Full-time"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Role/Title</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g., Lead Product Designer"
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Company</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g., Healthify"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g., San Francisco, CA"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Achievements</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={achievementInput}
                      onChange={(e) => setAchievementInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAchievement())}
                      placeholder="Add an achievement..."
                      className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
                    />
                    <button type="button" onClick={addAchievement} className="px-4 py-2 bg-secondary hover:bg-accent/10 rounded-lg transition-colors">
                      <Plus size={18} />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-secondary rounded-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                        <span className="flex-1 text-sm">{achievement}</span>
                        <button type="button" onClick={() => removeAchievement(index)} className="p-1 hover:text-red-500 transition-colors">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-foreground text-background rounded-lg hover:bg-accent hover:text-white transition-all font-medium"
                  >
                    <Save size={18} />
                    Save Entry
                  </button>
                  <button type="button" onClick={onClose} className="px-6 py-3 border border-border rounded-lg hover:bg-secondary transition-colors font-medium">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Logo Editor Modal Component
function LogoEditorModal({ logo, isOpen, onClose, onSave }: any) {
  const [formData, setFormData] = useState<Logo>({
    name: logo?.name || "",
    abbr: logo?.abbr || "",
  });

  useEffect(() => {
    if (logo) {
      setFormData(logo);
    } else {
      setFormData({
        name: "",
        abbr: "",
      });
    }
  }, [logo, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-foreground" style={{ fontFamily: "Fraunces, serif" }}>
                  {logo ? "Edit Logo" : "New Logo"}
                </h2>
                <button onClick={onClose} className="p-2 hover:bg-secondary rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Company Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., NHS England"
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Display Text (Abbreviation)</label>
                  <input
                    type="text"
                    value={formData.abbr}
                    onChange={(e) => setFormData({ ...formData, abbr: e.target.value })}
                    placeholder="e.g., NHS"
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-foreground text-background rounded-lg hover:bg-accent hover:text-white transition-all font-medium"
                  >
                    <Save size={18} />
                    Save Logo
                  </button>
                  <button type="button" onClick={onClose} className="px-6 py-3 border border-border rounded-lg hover:bg-secondary transition-colors font-medium">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Main Content Manager Component
export function ContentManager() {
  const { isEditMode, projects, updateProjects, content, updateContent, uploadImage } = useEdit();
  const [uploadingToolId, setUploadingToolId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"projects" | "career" | "logos" | "contact" | "tools" | "settings">("projects");
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Projects state
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // Career state
  const [careers, setCareers] = useState<Career[]>([]);
  const [editingCareer, setEditingCareer] = useState<Career | null>(null);
  const [isCareerModalOpen, setIsCareerModalOpen] = useState(false);

  // Logos state
  const [logos, setLogos] = useState<Logo[]>([]);
  const [editingLogo, setEditingLogo] = useState<Logo | null>(null);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [editingLogoIndex, setEditingLogoIndex] = useState<number | null>(null);

  // Contact state
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: "",
    linkedin: "",
    resumeLink: "",
  });

  // Load content
  useEffect(() => {
    setCareers(content["careers"] || []);
    setLogos(content["logos"] || []);
    setContactInfo(content["contactInfo"] || { email: "", linkedin: "", resumeLink: "" });
  }, [content]);

  // Project handlers
  const handleAddProject = () => {
    setEditingProject(null);
    setIsProjectModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = (project: Project) => {
    if (editingProject) {
      updateProjects(projects.map((p) => (p.id === project.id ? project : p)));
    } else {
      updateProjects([...projects, project]);
    }
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      updateProjects(projects.filter((p) => p.id !== id));
    }
  };

  const handleReorderProject = (index: number, direction: "up" | "down") => {
    const newProjects = [...projects];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;
    [newProjects[index], newProjects[targetIndex]] = [newProjects[targetIndex], newProjects[index]];
    updateProjects(newProjects);
  };

  // Career handlers
  const handleAddCareer = () => {
    setEditingCareer(null);
    setIsCareerModalOpen(true);
  };

  const handleEditCareer = (career: Career) => {
    setEditingCareer(career);
    setIsCareerModalOpen(true);
  };

  const handleSaveCareer = (career: Career) => {
    let newCareers;
    if (editingCareer) {
      newCareers = careers.map((c) => (c.id === career.id ? career : c));
    } else {
      newCareers = [...careers, career];
    }
    setCareers(newCareers);
    updateContent("careers", newCareers);
  };

  const handleDeleteCareer = (id: string) => {
    if (window.confirm("Are you sure you want to delete this career entry?")) {
      const newCareers = careers.filter((c) => c.id !== id);
      setCareers(newCareers);
      updateContent("careers", newCareers);
    }
  };

  const handleReorderCareer = (index: number, direction: "up" | "down") => {
    const newCareers = [...careers];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= careers.length) return;
    [newCareers[index], newCareers[targetIndex]] = [newCareers[targetIndex], newCareers[index]];
    setCareers(newCareers);
    updateContent("careers", newCareers);
  };

  // Logo handlers
  const handleAddLogo = () => {
    setEditingLogo(null);
    setEditingLogoIndex(null);
    setIsLogoModalOpen(true);
  };

  const handleEditLogo = (logo: Logo, index: number) => {
    setEditingLogo(logo);
    setEditingLogoIndex(index);
    setIsLogoModalOpen(true);
  };

  const handleSaveLogo = (logo: Logo) => {
    let newLogos;
    if (editingLogoIndex !== null) {
      newLogos = logos.map((l, i) => (i === editingLogoIndex ? logo : l));
    } else {
      newLogos = [...logos, logo];
    }
    setLogos(newLogos);
    updateContent("logos", newLogos);
  };

  const handleDeleteLogo = (index: number) => {
    if (window.confirm("Are you sure you want to delete this logo?")) {
      const newLogos = logos.filter((_, i) => i !== index);
      setLogos(newLogos);
      updateContent("logos", newLogos);
    }
  };

  const handleReorderLogo = (index: number, direction: "up" | "down") => {
    const newLogos = [...logos];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= logos.length) return;
    [newLogos[index], newLogos[targetIndex]] = [newLogos[targetIndex], newLogos[index]];
    setLogos(newLogos);
    updateContent("logos", newLogos);
  };

  // Contact handlers
  const handleSaveContact = () => {
    updateContent("contactInfo", contactInfo);
    alert("Contact info saved!");
  };

  if (!isEditMode) {
    return null;
  }

  return (
    <>
      <div className={`fixed top-24 right-8 z-40 bg-card border border-border rounded-2xl shadow-lg transition-all ${isCollapsed ? 'p-3' : 'p-6 w-[800px] max-h-[80vh] flex flex-col'}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4 shrink-0">
          {!isCollapsed && (
            <h3 className="text-lg font-semibold" style={{ fontFamily: "Fraunces, serif" }}>
              Content Manager
            </h3>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-secondary rounded-lg transition-colors text-sm"
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? "📂" : "📁"}
          </button>
        </div>

        {!isCollapsed && (
          <>
            {/* Tabs */}
            <div className="flex gap-2 mb-4 border-b border-border pb-2 shrink-0">
              <button
                onClick={() => setActiveTab("projects")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "projects" ? "bg-accent text-white" : "hover:bg-secondary"}`}
              >
                <Briefcase size={16} />
                Projects
              </button>
              <button
                onClick={() => setActiveTab("career")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "career" ? "bg-accent text-white" : "hover:bg-secondary"}`}
              >
                <User size={16} />
                Career
              </button>
              <button
                onClick={() => setActiveTab("logos")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "logos" ? "bg-accent text-white" : "hover:bg-secondary"}`}
              >
                <ImageIcon size={16} />
                Logos
              </button>
              <button
                onClick={() => setActiveTab("contact")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "contact" ? "bg-accent text-white" : "hover:bg-secondary"}`}
              >
                <Link2 size={16} />
                Contact
              </button>
              <button
                onClick={() => setActiveTab("tools")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "tools" ? "bg-accent text-white" : "hover:bg-secondary"}`}
              >
                <Wrench size={16} />
                Tools
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "settings" ? "bg-accent text-white" : "hover:bg-secondary"}`}
              >
                <Settings2 size={16} />
                Settings
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Projects Tab */}
              {activeTab === "projects" && (
                <div className="space-y-3">
                  <button
                    onClick={handleAddProject}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-medium"
                  >
                    <Plus size={18} />
                    Add Project
                  </button>

                  {projects.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No projects yet. Click above to add one.
                    </p>
                  )}

                  {projects.map((project, index) => (
                    <div key={project.id} className="p-4 bg-secondary rounded-lg border border-border space-y-2">
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col gap-1 mt-1">
                          <button
                            onClick={() => handleReorderProject(index, "up")}
                            disabled={index === 0}
                            className="p-1 hover:bg-background rounded disabled:opacity-30"
                          >
                            <GripVertical size={14} />
                          </button>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{project.title}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">{project.description}</p>
                          {project.featured && (
                            <span className="inline-block mt-1 text-xs bg-accent/20 text-accent px-2 py-0.5 rounded">
                              Featured
                            </span>
                          )}
                        </div>

                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEditProject(project)}
                            className="p-2 hover:bg-background rounded transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Career Tab */}
              {activeTab === "career" && (
                <div className="space-y-3">
                  <button
                    onClick={handleAddCareer}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-medium"
                  >
                    <Plus size={18} />
                    Add Career Entry
                  </button>

                  {careers.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No career entries yet. Click above to add one.
                    </p>
                  )}

                  {careers.map((career, index) => (
                    <div key={career.id} className="p-4 bg-secondary rounded-lg border border-border space-y-2">
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col gap-1 mt-1">
                          <button
                            onClick={() => handleReorderCareer(index, "up")}
                            disabled={index === 0}
                            className="p-1 hover:bg-background rounded disabled:opacity-30"
                          >
                            <GripVertical size={14} />
                          </button>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{career.role}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {career.company} · {career.year}
                          </p>
                        </div>

                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEditCareer(career)}
                            className="p-2 hover:bg-background rounded transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteCareer(career.id)}
                            className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Logos Tab */}
              {activeTab === "logos" && (
                <div className="space-y-3">
                  <button
                    onClick={handleAddLogo}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-medium"
                  >
                    <Plus size={18} />
                    Add Logo
                  </button>

                  {logos.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No logos yet. Click above to add one.
                    </p>
                  )}

                  <div className="space-y-2">
                    {logos.map((logo, index) => (
                      <div key={index} className="p-3 bg-secondary rounded-lg border border-border flex items-center gap-3">
                        <button
                          onClick={() => handleReorderLogo(index, "up")}
                          disabled={index === 0}
                          className="p-1 hover:bg-background rounded disabled:opacity-30"
                        >
                          <GripVertical size={14} />
                        </button>
                        
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{logo.name}</p>
                          <p className="text-xs text-muted-foreground truncate">Display: {logo.abbr}</p>
                        </div>

                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEditLogo(logo, index)}
                            className="p-2 hover:bg-background rounded transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteLogo(index)}
                            className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tools Tab */}
              {activeTab === "tools" && (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground pb-1">
                    Upload an image to replace a tool logo. Click the reset button to restore the default icon.
                  </p>
                  {TOOL_DEFS.map(({ id, name }) => {
                    const toolUrls: Record<string, string> = content.toolUrls || {};
                    const currentUrl = toolUrls[id] || "";
                    const isUploading = uploadingToolId === id;
                    return (
                      <div key={id} className="flex items-center gap-3 p-3 bg-secondary rounded-lg border border-border">
                        {/* Preview */}
                        <div className="w-9 h-9 rounded-lg bg-background border border-border flex items-center justify-center shrink-0 overflow-hidden">
                          {currentUrl
                            ? <img src={currentUrl} alt={name} className="w-full h-full object-contain" />
                            : <span className="text-[9px] text-muted-foreground font-mono">{name.slice(0, 3).toUpperCase()}</span>
                          }
                        </div>

                        {/* Name */}
                        <span className="flex-1 text-sm font-medium truncate">{name}</span>

                        {/* Upload button */}
                        <label className={`cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${isUploading ? "opacity-50 pointer-events-none" : "bg-accent/10 hover:bg-accent/20 text-accent"}`}>
                          <ImageIcon size={13} />
                          {isUploading ? "Uploading…" : "Upload"}
                          <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            disabled={isUploading}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              try {
                                setUploadingToolId(id);
                                const url = await uploadImage(file);
                                const updated = { ...toolUrls, [id]: url };
                                updateContent("toolUrls", updated);
                              } catch (err) {
                                console.error("Tool logo upload failed:", err);
                              } finally {
                                setUploadingToolId(null);
                                e.target.value = "";
                              }
                            }}
                          />
                        </label>

                        {/* Reset */}
                        {currentUrl && (
                          <button
                            onClick={() => {
                              const updated = { ...toolUrls };
                              delete updated[id];
                              updateContent("toolUrls", updated);
                            }}
                            className="p-1.5 hover:text-red-500 transition-colors text-muted-foreground"
                            title="Reset to default icon"
                          >
                            <X size={13} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="space-y-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Site Features</p>

                  {/* Custom Cursor Style Picker */}
                  <div className="p-4 bg-secondary/40 rounded-xl border border-border space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                        <MousePointer2 size={16} className="text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Custom Cursor</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Choose a cursor style for visitors</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {(["off", "ring", "fancy"] as const).map((opt) => {
                        const active = (content["feature:cursorStyle"] ?? "off") === opt;
                        const labels: Record<string, string> = { off: "Default", ring: "Ring", fancy: "Fancy" };
                        const previews: Record<string, React.ReactNode> = {
                          off: <span className="text-lg">🖱️</span>,
                          ring: (
                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                              <circle cx="11" cy="11" r="9" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="3 2" />
                              <circle cx="11" cy="11" r="2.5" fill="var(--accent)" />
                            </svg>
                          ),
                          fancy: (
                            <svg width="18" height="22" viewBox="0 0 18 22" fill="none">
                              <path d="M2 1L16 9L10 10.5L13 20L9 21.5L6 11.5L2 14L2 1Z" fill="var(--accent)" stroke="white" strokeWidth="0.8" strokeLinejoin="round" />
                            </svg>
                          ),
                        };
                        return (
                          <button
                            key={opt}
                            onClick={() => updateContent("feature:cursorStyle", opt)}
                            className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-lg border text-xs font-medium transition-all ${active ? "border-accent bg-accent/10 text-accent" : "border-border hover:border-accent/40 text-muted-foreground hover:text-foreground"}`}
                          >
                            <span className="flex items-center justify-center h-6">{previews[opt]}</span>
                            {labels[opt]}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Tab */}
              {activeTab === "contact" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Email Address</label>
                    <input
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                      placeholder="dominic@design.co"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">LinkedIn URL</label>
                    <input
                      type="url"
                      value={contactInfo.linkedin}
                      onChange={(e) => setContactInfo({ ...contactInfo, linkedin: e.target.value })}
                      placeholder="https://linkedin.com/in/dominicdesigns"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Resume Download Link</label>
                    <input
                      type="url"
                      value={contactInfo.resumeLink}
                      onChange={(e) => setContactInfo({ ...contactInfo, resumeLink: e.target.value })}
                      placeholder="https://drive.google.com/..."
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
                    />
                  </div>

                  <button
                    onClick={handleSaveContact}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-foreground text-background rounded-lg hover:bg-accent hover:text-white transition-all font-medium"
                  >
                    <Save size={18} />
                    Save Contact Info
                  </button>

                  <p className="text-xs text-muted-foreground text-center">
                    This info will be used in the Contact section
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <ProjectEditorModal
        project={editingProject}
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSave={handleSaveProject}
      />

      <CareerEditorModal
        career={editingCareer}
        isOpen={isCareerModalOpen}
        onClose={() => setIsCareerModalOpen(false)}
        onSave={handleSaveCareer}
      />

      <LogoEditorModal
        logo={editingLogo}
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
        onSave={handleSaveLogo}
      />
    </>
  );
}
