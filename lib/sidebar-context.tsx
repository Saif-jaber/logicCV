"use client";

import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useSyncExternalStore,
  useState,
} from "react";

type SidebarContextType = {
  collapsed: boolean;
  toggleCollapsed: () => void;
  mobileOpen: boolean;
  openMobile: () => void;
  closeMobile: () => void;
};

const SidebarContext = createContext<SidebarContextType | null>(null);

const STORAGE_KEY = "sidebar-collapsed";
const CHANGE_EVENT = "logiccv:sidebar-collapse";

function getSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(STORAGE_KEY) === "true";
}

function getServerSnapshot(): boolean {
  return false;
}

function subscribe(callback: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const collapsed = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapsed = useCallback(() => {
    startTransition(() => {
      window.localStorage.setItem(STORAGE_KEY, String(!getSnapshot()));
      window.dispatchEvent(new Event(CHANGE_EVENT));
    });
  }, []);

  const openMobile = useCallback(() => setMobileOpen(true), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <SidebarContext.Provider
      value={{
        collapsed,
        toggleCollapsed,
        mobileOpen,
        openMobile,
        closeMobile,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
  return ctx;
}