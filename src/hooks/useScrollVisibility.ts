/**
 * useScrollVisibility: Tracks whether a target element (by ref or id) is visible in the viewport.
 * Returns false when the element is scrolled out of view.
 */
import { useState, useEffect, useRef, type RefObject } from "react";

export function useElementVisible(elementId: string): boolean {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = document.getElementById(elementId);
    if (!el) { setVisible(false); return; }

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [elementId]);

  return visible;
}
