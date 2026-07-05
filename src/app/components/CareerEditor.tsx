import { useState, useEffect } from "react";
import { useEdit } from "./EditContext";
import { Plus, Edit2, Trash2, GripVertical, X, Save } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Career {
  id: string;
  year: string;
  role: string;
  company: string;
  location: string;
  type: string;
  achievements: string[];
}

interface CareerEditorModalProps {
  career: Career | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (career: Career) => void;
}

function CareerEditorModal({ career, isOpen, onClose, onSave }: CareerEditorModalProps) {
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
      setFormData({
        id: career.id,
        year: career.year,
        role: career.role,
        company: career.company,
        location: career.location,
        type: career.type,
        achievements: career.achievements,
      });
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
                <h2
                  className="text-2xl font-semibold text-foreground"
                  style={{ fontFamily: "Fraunces, serif" }}
                >
                  {career ? "Edit Career Entry" : "New Career Entry"}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Year/Period
                    </label>
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
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Employment Type
                    </label>
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
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Role/Title
                  </label>
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
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Company
                    </label>
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
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Location
                    </label>
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
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Achievements
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={achievementInput}
                      onChange={(e) => setAchievementInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAchievement())}
                      placeholder="Add an achievement..."
                      className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
                    />
                    <button
                      type="button"
                      onClick={addAchievement}
                      className="px-4 py-2 bg-secondary hover:bg-accent/10 rounded-lg transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.achievements.map((achievement, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 p-3 bg-secondary rounded-lg"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                        <span className="flex-1 text-sm">{achievement}</span>
                        <button
                          type="button"
                          onClick={() => removeAchievement(index)}
                          className="p-1 hover:text-red-500 transition-colors"
                        >
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

export function CareerEditor() {
  const { isEditMode, content, updateContent } = useEdit();
  const [careers, setCareers] = useState<Career[]>([]);
  const [editingCareer, setEditingCareer] = useState<Career | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load careers from content
  useEffect(() => {
    const loadedCareers = content["careers"] || [];
    setCareers(loadedCareers);
  }, [content]);

  const handleAddCareer = () => {
    setEditingCareer(null);
    setIsModalOpen(true);
  };

  const handleEditCareer = (career: Career) => {
    setEditingCareer(career);
    setIsModalOpen(true);
  };

  const handleSaveCareer = (career: Career) => {
    let newCareers;
    if (editingCareer) {
      // Update existing
      newCareers = careers.map((c) => (c.id === career.id ? career : c));
    } else {
      // Add new
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

  const handleReorder = (index: number, direction: "up" | "down") => {
    const newCareers = [...careers];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= careers.length) return;

    [newCareers[index], newCareers[targetIndex]] = [newCareers[targetIndex], newCareers[index]];
    setCareers(newCareers);
    updateContent("careers", newCareers);
  };

  if (!isEditMode) {
    return null;
  }

  return (
    <>
      <div className={`fixed top-24 left-8 z-40 bg-card border border-border rounded-2xl shadow-lg transition-all ${isCollapsed ? 'p-3' : 'p-6 max-w-sm max-h-[70vh] overflow-y-auto'}`}>
        <div className="flex items-center justify-between mb-4">
          {!isCollapsed && (
            <h3 className="text-lg font-semibold" style={{ fontFamily: "Fraunces, serif" }}>
              Career Journey
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
                onClick={handleAddCareer}
                className="p-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
              >
                <Plus size={18} />
              </button>
            )}
          </div>
        </div>

        {!isCollapsed && (
          <div className="space-y-3">
          {careers.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No career entries yet. Click + to add one.
            </p>
          )}

          {careers.map((career, index) => (
            <div
              key={career.id}
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
      </div>

      <CareerEditorModal
        career={editingCareer}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCareer}
      />
    </>
  );
}
