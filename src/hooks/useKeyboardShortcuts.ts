/**
 * useKeyboardShortcuts: Global keyboard shortcuts for navigation.
 * / = focus search, w = watchlist, p = portfolio, ? = shows help via callback.
 * Only fires when not typing in an input/textarea.
 */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useKeyboardShortcuts() {
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      switch (e.key) {
        case "/":
          e.preventDefault();
          const searchInput = document.querySelector<HTMLInputElement>("[data-search-input]");
          searchInput?.focus();
          break;
        case "w":
          navigate("/watchlist");
          break;
        case "p":
          navigate("/portfolio");
          break;
        case "h":
          navigate("/");
          break;
        case "n":
          navigate("/news");
          break;
        case "r":
          navigate("/rankings");
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate]);
}
