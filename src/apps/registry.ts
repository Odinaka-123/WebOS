import Notepad from "./Notepad";
import Calculator from "./Calculator";
import type { ComponentType } from "react";

export interface AppDef {
  id: string;
  title: string;
  icon: string;
  component: ComponentType;
  defaultSize: { w: number; h: number };
}

// Add new apps here. Each entry becomes a desktop icon + start menu item.
export const APPS: Record<string, AppDef> = {
  notepad: {
    id: "notepad",
    title: "Notepad",
    icon: "📝",
    component: Notepad,
    defaultSize: { w: 480, h: 360 },
  },
  calculator: {
    id: "calculator",
    title: "Calculator",
    icon: "🧮",
    component: Calculator,
    defaultSize: { w: 280, h: 380 },
  },
};
