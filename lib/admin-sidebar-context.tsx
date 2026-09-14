"use client";

import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useRef,
  useSyncExternalStore,
  useState,
} from "react";

type AdminSidebarContextType = {
  collapsed: boolean;
  toggleCollapsed: () => void;
  mobileOpen: boolean;
  openMobile: () => void;
  closeMobile: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
};

const AdminSidebarContext = createContext<AdminSidebarContextType | null>(null);

const STORAGE_KEY = "admin-sidebar-collapsed";
const CHANGE_EVENT = "logiccv:admin-sidebar-collapse";

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

export function AdminSidebarProvider({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const collapsed = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const toggleCollapsed = useCallback(() => {
    startTransition(() => {
      window.localStorage.setItem(STORAGE_KEY, String(!getSnapshot()));
      window.dispatchEvent(new Event(CHANGE_EVENT));
    });
  }, []);

  const openMobile = useCallback(() => setMobileOpen(true), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <AdminSidebarContext.Provider
      value={{
        collapsed,
        toggleCollapsed,
        mobileOpen,
        openMobile,
        closeMobile,
        containerRef,
      }}
    >
      <div ref={containerRef} className={className}>
        {children}
      </div>
    </AdminSidebarContext.Provider>
  );
}

export function useAdminSidebar() {
  const ctx = useContext(AdminSidebarContext);
  if (!ctx) {
    throw new Error("useAdminSidebar must be used within AdminSidebarProvider");
  }
  return ctx;
}