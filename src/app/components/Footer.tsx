import { Linkedin, BookOpen, Mail, Edit3 } from "lucide-react";
import { useEdit } from "./EditContext";

const socialLinks = [
  { icon: <Linkedin size={16} />, label: "LinkedIn", href: "#" },
  { icon: <BookOpen size={16} />, label: "Behance", href: "#" },
  { icon: <Mail size={16} />, label: "Email", href: "mailto:alexandra.chen@design.co" },
];

export function Footer() {
  const { toggleEditMode } = useEdit();
  return (
    <footer className="border-t border-border px-[0px] py-[12px]">
      <div className="max-w-[1320px] mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <span
            className="text-[14px] text-foreground"
            style={{ fontFamily: "Fraunces, serif", fontWeight: 600 }}
          ><span className="">Crafted with&nbsp;&nbsp;❤️&nbsp;&nbsp;Dominic</span></span>
          <span className="text-muted-foreground text-[13px] font-bold italic" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}><span className="">| Happy Recruting&nbsp;&nbsp;😃</span></span>
          <button
            onClick={toggleEditMode}
            className="ml-2 p-1.5 rounded-lg hover:bg-secondary transition-colors group"
            aria-label="Enter edit mode"
            title="Enter edit mode"
          >
            <Edit3 size={14} className="text-muted-foreground group-hover:text-accent transition-colors" />
          </button>
        </div>

        

        <p
          className="text-[12px] text-muted-foreground"
          style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
        >
          © 2026 Dominic. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
