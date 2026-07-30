"use client";

import { createContext, useContext, useState } from "react";

type SidebarContextValue = { collapsed: boolean; toggle: () => void; setCollapsed: (value: boolean) => void };
const SidebarContext = createContext<SidebarContextValue | null>(null);
const storageKey = "admin-sidebar-collapsed";

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(() => typeof window !== "undefined" && localStorage.getItem(storageKey) === "true");
  const update = (value: boolean) => { setCollapsed(value); localStorage.setItem(storageKey, String(value)); };
  return <SidebarContext.Provider value={{ collapsed, setCollapsed: update, toggle: () => update(!collapsed) }}>{children}</SidebarContext.Provider>;
}

export const useSidebar = () => { const context = useContext(SidebarContext); if (!context) throw new Error("useSidebar must be used within SidebarProvider"); return context; };
