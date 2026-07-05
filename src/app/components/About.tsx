import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { EditableText } from "./EditableText";
import { useEdit } from "./EditContext";
import { Upload } from "lucide-react";

const moments = [
  { emoji: "☕", label: "Mornings", text: "Strong coffee, market updates, and a few quiet moments before the notifications begin their daily attack." },
  { emoji: "🥾", label: "Weekends", text: "Family time, and the occasional deep dive into a business idea that somehow ends with twelve browser tabs open." },
  { emoji: "🍜", label: "Evenings", text: "Building products, learning new things, and chasing - one last design tweak." },
  { emoji: "🎧", label: "Always on", text: "Curiosity. Whether it's human behavior, investing, emerging technology. I'm usually asking ,why? followed closely by , what if?" },
];

// Draggable Photo Component
function DraggablePhoto({ photo, index, onImageChange }: any) {
  const { isEditMode, uploadImage } = useEdit();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file");
      return;
    }
    try {
      setIsUploading(true);
      const url = await uploadImage(file);
      onImageChange(index, url);
    } catch (error: any) {
      console.error("Upload error:", error);
      alert(`Failed to upload image: ${error.message || 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.1}
      whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
      whileDrag={{ scale: 1.1, rotate: 0, zIndex: 20, cursor: "grabbing" }}
      initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
      animate={{ opacity: 1, scale: 1, rotate: photo.rotation || 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="absolute bg-white p-2 shadow-2xl cursor-grab group"
      style={{
        left: photo.left,
        top: photo.top,
        width: photo.width,
        zIndex: photo.zIndex,
        borderRadius: '6px',
      }}
    >
      {/* Pin at top */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full shadow-lg border-2 border-red-600" />

      {/* Photo */}
      <div className="relative w-full aspect-square overflow-hidden rounded-sm bg-secondary">
        <img
          src={photo.src}
          alt={`Memory ${index + 1}`}
          className="w-full h-full object-cover pointer-events-none"
        />

        {/* Edit mode overlay */}
        {isEditMode && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer z-10"
          >
            {isUploading ? (
              <p className="text-white text-xs">Uploading...</p>
            ) : (
              <div className="text-center">
                <Upload size={24} className="text-white mx-auto mb-1" />
                <p className="text-white text-xs">Change Photo</p>
              </div>
            )}
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>
    </motion.div>
  );
}

export function About() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { content, updateContent, isLoading } = useEdit();

  const collagePhotos = content.collagePhotos || [];

  const handleImageChange = (index: number, newUrl: string) => {
    const newPhotos = [...collagePhotos];
    newPhotos[index] = { ...newPhotos[index], src: newUrl };
    updateContent("collagePhotos", newPhotos);
  };

  return (
    <section id="about" className="py-16 md:py-36 bg-card border-t border-border overflow-hidden" ref={ref} style={{ position: 'relative' }}>
      {/* Animated decorative blurs */}
      <motion.div
        className="absolute top-20 -left-32 w-96 h-96 rounded-full bg-accent/10 blur-3xl pointer-events-none"
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-10 -right-32 w-96 h-96 rounded-full bg-accent/5 blur-3xl pointer-events-none"
        animate={{
          x: [0, -30, 0],
          y: [0, 20, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Floating geometric shapes */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-20 h-20 border-2 border-accent/20 rounded-2xl"
        animate={{
          rotate: [0, 90, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-1/3 left-1/4 w-16 h-16 bg-accent/10 rounded-full"
        animate={{
          y: [0, 30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="max-w-[1320px] mx-auto px-6 md:px-10 relative">
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-10 md:gap-20 items-start">
          {/* Left: Photo + decorative */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Draggable Photo Collage Canvas */}
            <div data-grab className="relative w-full h-[420px] sm:h-[560px] md:h-[760px] lg:h-[900px] border-2 border-dashed border-border/30 rounded-3xl overflow-visible bg-gradient-to-br from-secondary/30 to-background/50" style={{ position: 'relative' }}>
              {/* Grid pattern background - same as hero */}
              <div
                className="absolute inset-0 pointer-events-none opacity-30 p-[0px] mx-[0px] mt-[-25px] mb-[0px]"
                style={{
                  backgroundImage: `linear-gradient(rgba(129, 140, 248, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(129, 140, 248, 0.15) 1px, transparent 1px)`,
                  backgroundSize: "60px 60px",
                }}
              />

              {isLoading ? (
                /* Skeleton polaroids */
                <>
                  {[
                    { left: "10%", top: "25%", width: "35%", rotate: "-6deg" },
                    { left: "52%", top: "30%", width: "35%", rotate: "8deg" },
                    { left: "28%", top: "58%", width: "38%", rotate: "-4deg" },
                  ].map((pos, i) => (
                    <div
                      key={i}
                      className="absolute bg-white/10 animate-pulse rounded"
                      style={{ left: pos.left, top: pos.top, width: pos.width, transform: `rotate(${pos.rotate})` }}
                    >
                      <div className="p-2">
                        <div className="w-full aspect-square rounded-sm bg-muted/40" />
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                /* Draggable Photos */
                collagePhotos.map((photo: any, index: number) => (
                  <DraggablePhoto
                    key={photo.id}
                    photo={photo}
                    index={index}
                    onImageChange={handleImageChange}
                  />
                ))
              )}

              {/* Helper text at bottom */}
              {!isLoading && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
                  <p className="text-muted-foreground/60 italic font-bold text-[20px] p-[0px] text-center mx-[0px] mt-[0px] mb-[490px]" style={{ fontFamily: "Fraunces, serif" }}>Try moving frames around 🤩</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right: Personal story */}
          <div className="space-y-10 pt-4 md:pt-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            >
              <EditableText
                contentKey="about:heading"
                defaultValue="A little about me"
                as="p"
                className="text-[11px] uppercase tracking-[0.12em] text-accent mb-5"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 600 }}
              />
              <EditableText
                contentKey="about:title"
                defaultValue="Designer by trade, Investor by obsession "
                as="h2"
                className="text-[clamp(2rem,4vw,3rem)] leading-[1.1] tracking-[-0.025em] mb-6 text-foreground"
                style={{ fontFamily: "Fraunces, serif", fontWeight: 400 }}
              />
              <div className="space-y-4 text-[15px] text-muted-foreground leading-[1.8]" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                <EditableText
                  contentKey="about:paragraph1"
                  defaultValue="I grew up in Chennai, fascinated by how people think and behave. That curiosity led me into UX and product design, where I've spent the last 8+ years creating experiences across healthcare, fintech, e-commerce, and enterprise products."
                  as="p"
                  multiline
                />
                <EditableText
                  contentKey="about:paragraph2"
                  defaultValue="These days, I split my time between designing products and understanding human behavior. I'm married to my favorite person, recently became a dad, and have discovered that babies are the most honest UX reviewers around."
                  as="p"
                  multiline
                />
                <EditableText
                  contentKey="about:paragraph3"
                  defaultValue="Outside of work, you'll find me reading about psychology, sketching product ideas that may or may not become startups, tracking stocks, or debating whether my next big idea is genius or just sleep deprivation talking."
                  as="p"
                  multiline
                />
              </div>
            </motion.div>

            {/* Day in the life — moments with staggered animations */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              className="grid grid-cols-2 gap-3"
            >
              {moments.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="group liquid-glass liquid-sheen liquid-glow p-4 rounded-2xl transition-all duration-300 cursor-pointer flex flex-col gap-2.5"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[22px] leading-none">{m.emoji}</span>
                    <p
                      className="text-[11px] uppercase tracking-[0.12em] text-accent font-semibold"
                      style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                    >
                      {m.label}
                    </p>
                  </div>
                  <div className="h-px bg-border/50" />
                  <p
                    className="text-[12px] text-muted-foreground leading-relaxed"
                    style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                  >
                    {m.text}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
