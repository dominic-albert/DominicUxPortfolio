import { useState } from "react";
import { useEdit } from "./EditContext";
import { Save, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function FloatingToolbar() {
  const { isEditMode, toggleEditMode, saveChanges, hasUnsavedChanges } = useEdit();
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaved(false);
      setSaveError(false);
      await saveChanges();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (error) {
      console.error("Save error:", error);
      setSaveError(true);
      setTimeout(() => setSaveError(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isEditMode && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="bg-foreground text-background rounded-full shadow-2xl border border-border/20 px-6 py-3 flex items-center gap-4">
            <div
              className="text-sm font-medium"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              Edit Mode
              {hasUnsavedChanges && (
                <span className="ml-2 text-xs opacity-70">(Unsaved changes)</span>
              )}
            </div>

            <div className="h-6 w-px bg-background/20" />

            <button
              onClick={handleSave}
              disabled={isSaving || !hasUnsavedChanges}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium ${
                saved ? "bg-emerald-500/20 text-emerald-300" : saveError ? "bg-red-500/20 text-red-300" : "bg-background/10 hover:bg-background/20"
              }`}
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              {saved ? <Check size={16} /> : <Save size={16} />}
              {isSaving ? "Saving…" : saved ? "Saved!" : saveError ? "Failed" : "Save"}
            </button>

            <button
              onClick={toggleEditMode}
              className="flex items-center gap-2 px-4 py-2 bg-background/10 hover:bg-background/20 rounded-full transition-colors text-sm font-medium"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              <X size={16} />
              Exit
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
