import type { ComponentType } from "react";
import Notepad from "./Notepad";
import Calculator from "./Calculator";
import { NotepadIcon, CalculatorIcon } from "@/components/Icons";

export interface AppDef {
  id: string;
  title: string;
  icon: ComponentType<{ className?: string }>;
  component: ComponentType;
  defaultSize: { w: number; h: number };
}

export const APPS: Record<string, AppDef> = {
  notepad: {
    id: "notepad",
    title: "Notepad",
    icon: NotepadIcon,
    component: Notepad,
    defaultSize: { w: 480, h: 360 },
  },
  calculator: {
    id: "calculator",
    title: "Calculator",
    icon: CalculatorIcon,
    component: Calculator,
    defaultSize: { w: 280, h: 380 },
  },
};
