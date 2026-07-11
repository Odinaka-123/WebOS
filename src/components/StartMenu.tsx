"use client";

import { APPS, type AppDef } from "@/apps/registry";

export default function StartMenu({
  onLaunch,
  onClose,
}: {
  onLaunch: (app: AppDef) => void;
  onClose: () => void;
}) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute bottom-12 left-2 z-50 w-56 bg-desk-panel border border-desk-border rounded-md shadow-window overflow-hidden">
        <div className="px-3 py-2 text-[11px] uppercase tracking-widest text-desk-text-dim border-b border-desk-border font-display">
          Applications
        </div>
        {Object.values(APPS).map((app) => {
          const Icon = app.icon;
          return (
            <button
              key={app.id}
              onClick={() => {
                onLaunch(app);
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-desk-text hover:bg-desk-panel-light hover:text-desk-accent text-left transition-colors"
            >
              <Icon className="w-4 h-4" />
              <span>{app.title}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}
