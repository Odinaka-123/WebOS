"use client";

import { useEffect, useState } from "react";
import { useWindowStore } from "@/store/WindowStore";
import { APPS } from "@/apps/registry";
import { GridIcon } from "@/components/Icons";

export default function Taskbar({
  onStartClick,
  startOpen,
}: {
  onStartClick: () => void;
  startOpen: boolean;
}) {
  const { windows, focusWindow, minimizeWindow } = useWindowStore();
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="h-11 bg-desk-panel border-t border-desk-border flex items-center px-2 gap-2 select-none">
      <button
        onClick={onStartClick}
        className={`flex items-center gap-2 px-3 h-8 rounded font-display text-sm text-desk-accent border border-desk-border hover:border-desk-accent-dim hover:bg-desk-panel-light transition-colors ${
          startOpen ? "bg-desk-panel-light border-desk-accent-dim" : ""
        }`}
      >
        <GridIcon className="w-3.5 h-3.5" />
        start
      </button>

      <div className="w-px h-6 bg-desk-border" />

      <div className="flex-1 flex items-center gap-1 overflow-x-auto">
        {windows.map((win) => {
          const app = APPS[win.appId];
          const Icon = app?.icon;
          return (
            <button
              key={win.id}
              onClick={() =>
                win.minimized ? focusWindow(win.id) : minimizeWindow(win.id)
              }
              className="h-8 px-3 rounded text-sm text-desk-text bg-desk-panel-light/60 hover:bg-desk-panel-light border border-desk-border flex items-center gap-2 whitespace-nowrap transition-colors"
            >
              {Icon && <Icon className="w-3.5 h-3.5" />}
              <span>{win.title}</span>
            </button>
          );
        })}
      </div>

      <div className="text-xs text-desk-text-dim font-display px-2 tabular-nums">
        {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </div>
    </div>
  );
}
