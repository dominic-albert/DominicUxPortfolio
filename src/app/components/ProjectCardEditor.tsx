import { useState, useEffect } from "react";
import { useEdit } from "./EditContext";
import { Plus, Edit2, Trash2, GripVertical, X, Save, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  thumbnail: string;
  caseStudyLink: string;
  featured: boolean;
  outcome?: string;
  accent?: string;
}

interface ProjectEditorModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
}

function ProjectEditorModal({ project, isOpen, onClose, onSave }: ProjectEditorModalProps) {
  const { uploadImage } = useEdit();
  const [tagInput, setTagInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Initialize formData based on project prop
  const [formData, setFormData] = useState<Project>({
    id: project?.id || Date.now().toString(),
    title: project?.title || "",
    description: project?.description || "",
    tags: project?.tags || [],
    thumbnail: project?.thumbnail || "",
    caseStudyLink: project?.caseStudyLink || "",
    featured: project?.featured || false,
    outcome: project?.outcome || "",
    accent: project?.accent || "#F5F4F0",
  });

  // Update formData when project changes
  useEffect(() => {
    if (project) {
      setFormData({
        id: project.id,
        title: project.title,
        description: project.description,
        tags: project.tags,
        thumbnail: project.thumbnail,
        caseStudyLink: project.caseStudyLink,
        featured: project.featured,
        outcome: project.outcome || "",
        accent: project.accent || "#F5F4F0",
      });
    } else {
      // Reset for new project
      setFormData({
        id: Date.now().toString(),
        title: "",
        description: "",
        tags: [],
        thumbnail: "",
        caseStudyLink: "",
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

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
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
                <h2
                  className="text-2xl font-semibold text-foreground"
                  style={{ fontFamily: "Fraunces, serif" }}
                >
                  {project ? "Edit Project" : "New Project"}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Project Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-foreground resize-vertical"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Tags
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                      placeholder="Add a tag..."
                      className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-4 py-2 bg-secondary hover:bg-accent/10 rounded-lg transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-secondary rounded-full text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-red-500"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Thumbnail Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
                  />
                  {isUploading && <p className="text-sm text-muted-foreground mt-2">Uploading...</p>}
                  {formData.thumbnail && (
                    <img
                      src={formData.thumbnail}
                      alt="Thumbnail preview"
                      className="mt-4 w-full h-48 object-cover rounded-lg"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Outcome/Impact Quote (shown on image)
                  </label>
                  <input
                    type="text"
                    value={formData.outcome || ""}
                    onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
                    placeholder="e.g., 62% reduction in appointment drop-off"
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Case Study Link (Notion or external URL)
                  </label>
                  <input
                    type="url"
                    value={formData.caseStudyLink}
                    onChange={(e) => setFormData({ ...formData, caseStudyLink: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Background Color
                  </label>
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
                  <label htmlFor="featured" className="text-sm font-medium text-foreground">
                    Featured Project (larger card size)
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-foreground text-background rounded-lg hover:bg-accent hover:text-white transition-all font-medium"
                  >
                    <Save size={18} />
                    Save Project
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 border border-border rounded-lg hover:bg-secondary transition-colors font-medium"
                  >
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

export function ProjectCardEditor() {
  const { isEditMode, projects, updateProjects } = useEdit();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleAddProject = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleSaveProject = (project: Project) => {
    if (editingProject) {
      // Update existing
      updateProjects(projects.map((p) => (p.id === project.id ? project : p)));
    } else {
      // Add new
      updateProjects([...projects, project]);
    }
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      updateProjects(projects.filter((p) => p.id !== id));
    }
  };

  const handleReorder = (index: number, direction: "up" | "down") => {
    const newProjects = [...projects];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    [newProjects[index], newProjects[targetIndex]] = [newProjects[targetIndex], newProjects[index]];
    updateProjects(newProjects);
  };

  if (!isEditMode) {
    return null;
  }

  return (
    <>
      <div className={`fixed top-24 right-8 z-40 bg-card border border-border rounded-2xl shadow-lg transition-all ${isCollapsed ? 'p-3' : 'p-6 max-w-sm max-h-[70vh] overflow-y-auto'}`}>
        <div className="flex items-center justify-between mb-4">
          {!isCollapsed && (
            <h3 className="text-lg font-semibold" style={{ fontFamily: "Fraunces, serif" }}>
              Manage Projects
            </h3>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 hover:bg-secondary rounded-lg transition-colors text-sm"
              title={isCollapsed ? "Expand" : "Collapse"}
            >
              {isCollapsed ? "📂" : "📁"}
            </button>
            {!isCollapsed && (
              <button
                onClick={handleAddProject}
                className="p-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
              >
                <Plus size={18} />
              </button>
            )}
          </div>
        </div>

        {!isCollapsed && (
          <div className="space-y-3">
            {projects.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                No projects yet. Click + to add one.
              </p>
            )}

            {projects.map((project, index) => (
            <div
              key={project.id}
              className="p-4 bg-secondary rounded-lg border border-border space-y-2"
            >
              <div className="flex items-start gap-3">
                <div className="flex flex-col gap-1 mt-1">
                  <button
                    onClick={() => handleReorder(index, "up")}
                    disabled={index === 0}
                    className="p-1 hover:bg-background rounded disabled:opacity-30"
                  >
                    <GripVertical size={14} />
                  </button>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{project.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {project.description}
                  </p>
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
      </div>

      <ProjectEditorModal
        project={editingProject}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProject}
      />
    </>
  );
}
