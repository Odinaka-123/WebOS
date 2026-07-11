"use client";

import { useCallback, useRef } from "react";
import { useWindowStore, type WinState } from "@/store/WindowStore";
import { APPS } from "@/apps/registry";

export default function Window({ win }: { win: WinState }) {
  const {
    windows,
    focusWindow,
    closeWindow,
    minimizeWindow,
    toggleMaximize,
    moveWindow,
    resizeWindow,
  } = useWindowStore();
  const dragState = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);
  const resizeState = useRef<{
    startX: number;
    startY: number;
    origW: number;
    origH: number;
  } | null>(null);

  const app = APPS[win.appId];
  const Component = app?.component;
  const isFocused = win.z === Math.max(...windows.map((w) => w.z));

  const onTitleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      focusWindow(win.id);
      if (win.maximized) return;
      dragState.current = {
        startX: e.clientX,
        startY: e.clientY,
        origX: win.x,
        origY: win.y,
      };

      const onMove = (ev: MouseEvent) => {
        if (!dragState.current) return;
        const dx = ev.clientX - dragState.current.startX;
        const dy = ev.clientY - dragState.current.startY;
        moveWindow(
          win.id,
          dragState.current.origX + dx,
          Math.max(0, dragState.current.origY + dy),
        );
      };
      const onUp = () => {
        dragState.current = null;
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [win, focusWindow, moveWindow],
  );

  const onResizeMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      focusWindow(win.id);
      resizeState.current = {
        startX: e.clientX,
        startY: e.clientY,
        origW: win.w,
        origH: win.h,
      };

      const onMove = (ev: MouseEvent) => {
        if (!resizeState.current) return;
        const dx = ev.clientX - resizeState.current.startX;
        const dy = ev.clientY - resizeState.current.startY;
        resizeWindow(
          win.id,
          Math.max(240, resizeState.current.origW + dx),
          Math.max(160, resizeState.current.origH + dy),
        );
      };
      const onUp = () => {
        resizeState.current = null;
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [win, focusWindow, resizeWindow],
  );

  if (win.minimized) return null;

  const style: React.CSSProperties =
    win.maximized ?
      {
        left: 0,
        top: 0,
        width: "100%",
        height: "calc(100% - 44px)",
        zIndex: win.z,
      }
    : {
        left: win.x,
        top: win.y,
        width: win.w,
        height: win.h,
        zIndex: win.z,
        boxShadow:
          isFocused ?
            "var(--shadow-focus), var(--shadow-window)"
          : "var(--shadow-window)",
      };

  return (
    <div
      className={`absolute bg-desk-panel rounded-md flex flex-col overflow-hidden border ${
        isFocused ? "border-desk-accent-dim" : "border-desk-border"
      }`}
      style={style}
      onMouseDown={() => focusWindow(win.id)}
    >
      <div
        className="h-8 flex items-center justify-between pl-3 pr-1.5 bg-desk-panel-light border-b border-desk-border cursor-grab active:cursor-grabbing select-none"
        onMouseDown={onTitleMouseDown}
        onDoubleClick={() => toggleMaximize(win.id)}
      >
        <span
          className={`text-xs font-display tracking-wide truncate ${isFocused ? "text-desk-accent" : "text-desk-text-dim"}`}
        >
          {win.title}
        </span>
        <div className="flex items-center gap-1 font-display text-xs">
          <button
            className="w-5 h-5 flex items-center justify-center rounded-sm border border-desk-border text-desk-text-dim hover:border-desk-accent-dim hover:text-desk-accent"
            title="Minimize"
            onClick={() => minimizeWindow(win.id)}
          >
            &ndash;
          </button>
          <button
            className="w-5 h-5 flex items-center justify-center rounded-sm border border-desk-border text-desk-text-dim hover:border-desk-accent-dim hover:text-desk-accent text-[10px]"
            title="Maximize"
            onClick={() => toggleMaximize(win.id)}
          >
            &#9633;
          </button>
          <button
            className="w-5 h-5 flex items-center justify-center rounded-sm border border-desk-border text-desk-text-dim hover:border-desk-danger hover:text-desk-danger"
            title="Close"
            onClick={() => closeWindow(win.id)}
          >
            &times;
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto win-scroll">
        {Component ?
          <Component />
        : <div className="p-4 text-desk-text-dim">Unknown app</div>}
      </div>

      {!win.maximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize"
          onMouseDown={onResizeMouseDown}
        />
      )}
    </div>
  );
}
