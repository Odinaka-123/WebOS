"use client";

import { useState } from "react";
import { useWindowStore } from "@/store/WindowStore";
import { APPS, type AppDef } from "@/apps/registry";
import DesktopIcon from "./DesktopIcon";
import Window from "./Window";
import Taskbar from "./Taskbar";
import StartMenu from "./StartMenu";
import BootFlicker from "./BootFlicker";

export default function Desktop() {
  const { windows, openWindow } = useWindowStore();
  const [startOpen, setStartOpen] = useState(false);

  const launch = (app: AppDef) =>
    openWindow({ appId: app.id, title: app.title, ...app.defaultSize });

  return (
    <div className="h-full w-full flex flex-col bg-desk-bg-2 relative overflow-hidden">
      <BootFlicker />

      <div className="glow-field">
        <div className="glow-orb glow-orb-amber" />
        <div className="glow-orb glow-orb-blue" />
      </div>

      <div className="scanlines absolute inset-0 pointer-events-none z-1" />

      <div className="relative z-10 flex-1 overflow-hidden">
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {Object.values(APPS).map((app) => (
            <DesktopIcon
              key={app.id}
              icon={app.icon}
              title={app.title}
              onOpen={() => launch(app)}
            />
          ))}
        </div>

        {windows.map((win) => (
          <Window key={win.id} win={win} />
        ))}

        {startOpen && (
          <StartMenu onLaunch={launch} onClose={() => setStartOpen(false)} />
        )}
      </div>

      <div className="relative z-10">
        <Taskbar
          startOpen={startOpen}
          onStartClick={() => setStartOpen((v) => !v)}
        />
      </div>
    </div>
  );
}
