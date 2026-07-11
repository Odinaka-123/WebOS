"use client";

import { useEffect, useState } from "react";

// Purely decorative one-time flicker played when the desktop mounts.
// Self-removes from the DOM after a fixed timeout so it can never linger
// and block clicks, even if its CSS animation classes fail to load.
export default function BootFlicker() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 650);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-60 pointer-events-none bg-desk-text animate-[boot-flicker_650ms_ease-out_forwards]" />
  );
}
