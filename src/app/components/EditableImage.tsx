import { useState, useRef } from "react";
import { useEdit } from "./EditContext";
import { Upload } from "lucide-react";

interface EditableImageProps {
  contentKey: string;
  defaultSrc: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

export function EditableImage({
  contentKey,
  defaultSrc,
  alt,
  className = "",
  style,
}: EditableImageProps) {
  const { isEditMode, content, updateContent, uploadImage } = useEdit();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentSrc = content[contentKey] || defaultSrc;

  const handleClick = () => {
    if (isEditMode && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const url = await uploadImage(file);
      updateContent(contentKey, url);
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative group w-full h-full">
      <img
        src={currentSrc}
        alt={alt}
        className={className}
        style={style}
      />

      {isEditMode && (
        <>
          <div
            className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center rounded cursor-pointer z-10"
            onClick={handleClick}
          >
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-white text-sm font-medium bg-black/60 px-4 py-2 rounded-lg">
              <Upload size={16} />
              {isUploading ? "Uploading..." : "Replace Image"}
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </>
      )}
    </div>
  );
}
