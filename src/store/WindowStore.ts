'use client'

import { create } from 'zustand'

export interface WinState {
  id: string
  appId: string
  title: string
  x: number
  y: number
  w: number
  h: number
  minimized: boolean
  maximized: boolean
  z: number
}

interface WindowStore {
  windows: WinState[]
  openWindow: (opts: { appId: string; title: string; w?: number; h?: number }) => string
  closeWindow: (id: string) => void
  focusWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  toggleMaximize: (id: string) => void
  moveWindow: (id: string, x: number, y: number) => void
  resizeWindow: (id: string, w: number, h: number) => void
}

let nextId = 1
let nextZ = 1

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: [],

  openWindow: ({ appId, title, w = 480, h = 360 }) => {
    const id = `win-${nextId++}`
    const z = nextZ++
    const offset = (get().windows.length % 6) * 24
    set((state) => ({
      windows: [
        ...state.windows,
        {
          id,
          appId,
          title,
          x: 120 + offset,
          y: 90 + offset,
          w,
          h,
          minimized: false,
          maximized: false,
          z,
        },
      ],
    }))
    return id
  },

  closeWindow: (id) =>
    set((state) => ({ windows: state.windows.filter((win) => win.id !== id) })),

  focusWindow: (id) => {
    const z = nextZ++
    set((state) => ({
      windows: state.windows.map((win) =>
        win.id === id ? { ...win, z, minimized: false } : win,
      ),
    }))
  },

  minimizeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((win) =>
        win.id === id ? { ...win, minimized: true } : win,
      ),
    })),

  toggleMaximize: (id) =>
    set((state) => ({
      windows: state.windows.map((win) =>
        win.id === id ? { ...win, maximized: !win.maximized } : win,
      ),
    })),

  moveWindow: (id, x, y) =>
    set((state) => ({
      windows: state.windows.map((win) => (win.id === id ? { ...win, x, y } : win)),
    })),

  resizeWindow: (id, w, h) =>
    set((state) => ({
      windows: state.windows.map((win) => (win.id === id ? { ...win, w, h } : win)),
    })),
}))