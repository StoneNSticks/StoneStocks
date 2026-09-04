/**
 * EarningsNotificationProvider: Wraps the app to run in-app earnings checks
 * and register the push service worker handler.
 */
import { useEffect } from "react";
import { useInAppEarningsCheck } from "@/hooks/useEarningsNotifications";

export function EarningsNotificationProvider({ children }: { children: React.ReactNode }) {
  useInAppEarningsCheck();

  // Register push handler in service worker
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      // The push handler is in public/sw-push.js — register it alongside the PWA SW
      // Service worker is already registered by vite-plugin-pwa; push events
      // are handled by the main SW. Nothing to do beyond awaiting readiness.
      void navigator.serviceWorker.ready;
    }
  }, []);

  return <>{children}</>;
}
