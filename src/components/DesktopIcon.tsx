"use client";

export default function DesktopIcon({
  icon,
  title,
  onOpen,
}: {
  icon: string;
  title: string;
  onOpen: () => void;
}) {
  return (
    <button
      onDoubleClick={onOpen}
      className="w-20 flex flex-col items-center gap-1 p-2 rounded hover:bg-white/5 focus:bg-white/10 outline-none"
    >
      <span className="text-3xl leading-none">{icon}</span>
      <span className="text-xs text-slate-200 text-center font-body drop-shadow">
        {title}
      </span>
    </button>
  );
}
