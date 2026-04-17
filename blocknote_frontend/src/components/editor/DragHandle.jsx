

import { GripVertical, Plus } from "lucide-react";

export const DragHandle = ({ isVisible, onAdd, listeners, isDragging }) => {
  return (
    <div
      className={`absolute -left-16 top-1/2 z-10 flex -translate-y-1/2 items-center gap-1 transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`rounded-md bg-background-elevated p-1 shadow-card ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        {...listeners}
      >
        <GripVertical className="h-4 w-4 text-foreground-muted" />
      </div>
      <button
        onClick={onAdd}
        className="rounded-md p-1 text-foreground-muted transition-colors hover:bg-white/10 hover:text-foreground"
        aria-label="Add block below"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
};