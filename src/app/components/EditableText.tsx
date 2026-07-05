import { useState, useRef, useEffect } from "react";
import { useEdit } from "./EditContext";

interface EditableTextProps {
  contentKey: string;
  defaultValue: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  style?: React.CSSProperties;
  multiline?: boolean;
  children?: React.ReactNode;
}

export function EditableText({
  contentKey,
  defaultValue,
  as: Component = "span",
  className = "",
  style,
  multiline = false,
  children,
}: EditableTextProps) {
  const { isEditMode, content, updateContent } = useEdit();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(content[contentKey] || defaultValue);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setValue(content[contentKey] || defaultValue);
  }, [content, contentKey, defaultValue]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleClick = () => {
    if (isEditMode && !isEditing) {
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    updateContent(contentKey, value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === "Escape") {
      setValue(content[contentKey] || defaultValue);
      setIsEditing(false);
    }
  };

  if (!isEditMode) {
    return (
      <Component className={className} style={style}>
        {children || value}
      </Component>
    );
  }

  if (isEditing) {
    const InputComponent = multiline ? "textarea" : "input";
    return (
      <InputComponent
        ref={inputRef as any}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`${className} outline-none ring-2 ring-accent rounded px-1`}
        style={{
          ...style,
          minWidth: "100px",
          resize: multiline ? "vertical" : undefined,
        }}
      />
    );
  }

  return (
    <Component
      className={`${className} cursor-text hover:outline-dashed hover:outline-1 hover:outline-accent/50 rounded px-1 transition-all`}
      style={style}
      onClick={handleClick}
    >
      {children || value}
    </Component>
  );
}
