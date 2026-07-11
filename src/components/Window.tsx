"use client";

import { useCallback, useRef } from "react";
import { useWindowStore, type WinState } from "@/store/WindowStore";
import { APPS } from "@/apps/registry";

export default function Window({ win }: { win: WinState }) {
  const {
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
    : { left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z };

  return (
    <div
      className="absolute bg-desk-panel border border-desk-border rounded-lg shadow-window flex flex-col overflow-hidden"
      style={style}
      onMouseDown={() => focusWindow(win.id)}
    >
      <div
        className="h-9 flex items-center justify-between px-3 bg-desk-panel-light border-b border-desk-border cursor-grab active:cursor-grabbing select-none"
        onMouseDown={onTitleMouseDown}
        onDoubleClick={() => toggleMaximize(win.id)}
      >
        <span className="text-sm font-display text-slate-200 truncate">
          {win.title}
        </span>
        <div className="flex items-center gap-2">
          <button
            className="w-3 h-3 rounded-full bg-yellow-500 hover:brightness-110"
            title="Minimize"
            onClick={() => minimizeWindow(win.id)}
          />
          <button
            className="w-3 h-3 rounded-full bg-emerald-500 hover:brightness-110"
            title="Maximize"
            onClick={() => toggleMaximize(win.id)}
          />
          <button
            className="w-3 h-3 rounded-full bg-rose-500 hover:brightness-110"
            title="Close"
            onClick={() => closeWindow(win.id)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto win-scroll">
        {Component ?
          <Component />
        : <div className="p-4 text-slate-400">Unknown app</div>}
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
