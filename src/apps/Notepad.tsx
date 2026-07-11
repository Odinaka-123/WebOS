"use client";

import { useState } from "react";

export default function Notepad() {
  const [text, setText] = useState("");

  return (
    <textarea
      className="win-scroll w-full h-full resize-none bg-desk-panel text-slate-100 p-3 text-sm font-body outline-none"
      placeholder="Start typing..."
      value={text}
      onChange={(e) => setText(e.target.value)}
    />
  );
}
