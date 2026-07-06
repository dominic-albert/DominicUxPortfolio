import { TOOL_DEFS } from "../data/tools";

export function ToolsGrid() {
  const totalRows = Math.ceil(TOOL_DEFS.length / 4);

  return (
    <div className="w-full grid grid-cols-4">
      {TOOL_DEFS.map((tool, i) => {
        const col       = i % 4;
        const row       = Math.floor(i / 4);
        const isLastCol = col === 3;
        const isLastRow = row === totalRows - 1;

        return (
          <div
            key={tool.id}
            className="flex flex-col items-center justify-center gap-2 py-6 px-3"
            style={{
              background: "transparent",
              boxShadow: [
                !isLastCol && "inset -1px 0 0 rgba(255,255,255,0.09)",
                !isLastRow && "inset 0 -1px 0 rgba(255,255,255,0.09)",
              ].filter(Boolean).join(", ") || "none",
            }}
          >
            <img
              src={tool.icon}
              alt={tool.name}
              className="w-10 h-10 object-contain"
              draggable={false}
            />
            <span
              className="text-[10px] tracking-wide"
              style={{ color: "rgba(255,255,255,0.60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 500 }}
            >
              {tool.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
