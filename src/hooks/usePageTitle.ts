/**
 * usePageTitle: Sets document.title and meta description for SEO.
 */
import { useEffect } from "react";

const BASE_TITLE = "StoneStocks";

export function usePageTitle(title: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${BASE_TITLE}` : BASE_TITLE;

    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", description);
    }

    return () => {
      document.title = BASE_TITLE;
    };
  }, [title, description]);
}
