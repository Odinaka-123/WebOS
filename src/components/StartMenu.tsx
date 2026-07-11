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
      <div className="absolute bottom-12 left-2 z-50 w-56 bg-desk-panel border border-desk-border rounded-lg shadow-window overflow-hidden">
        <div className="px-3 py-2 text-xs uppercase tracking-wide text-slate-400 border-b border-desk-border">
          Applications
        </div>
        {Object.values(APPS).map((app) => (
          <button
            key={app.id}
            onClick={() => {
              onLaunch(app);
              onClose();
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-200 hover:bg-desk-panel-light text-left"
          >
            <span>{app.icon}</span>
            <span>{app.title}</span>
          </button>
        ))}
      </div>
    </>
  );
}
