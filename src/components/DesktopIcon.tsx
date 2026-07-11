"use client";

import type { ComponentType } from "react";

export default function DesktopIcon({
  icon: Icon,
  title,
  onOpen,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  onOpen: () => void;
}) {
  return (
    <button
      onDoubleClick={onOpen}
      className="w-20 flex flex-col items-center gap-1.5 p-2 rounded outline-none group"
    >
      <span className="tile w-12 h-12 flex items-center justify-center rounded-lg text-desk-text-dim group-hover:text-desk-accent group-active:translate-y-px transition-all">
        <Icon className="w-6 h-6 drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]" />
      </span>
      <span className="text-xs text-desk-text text-center font-body drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
        {title}
      </span>
    </button>
  );
}
