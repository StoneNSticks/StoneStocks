

## Plan: Navigation anpassen

### Aenderungen an `Header.tsx`

**Row 1 (Utility bar):** CurrencyToggle und LanguageToggle zurueck in die obere Zeile neben ThemeToggle/NotificationBell (aus dem User-Dropdown entfernen).

**Row 2 (Nav bar):** Alle 11 Seiten als flache Links nebeneinander, kein Tools-Dropdown mehr. Reihenfolge:
Markets | Sentiment | Rankings | News | Screener | Portfolio | Watchlist | Calculators | Compare | Glossary | Learn

Kleiner vertikaler Divider zwischen Watchlist und Calculators als optische Trennung. Scrollbar bei schmalen Screens (`overflow-x-auto scrollbar-hide` bleibt).

User-Dropdown wird verschlankt: nur noch Profile, Settings, Logout (Currency/Language raus).

| Datei | Aenderung |
|---|---|
| `Header.tsx` | CurrencyToggle + LanguageToggle in Row 1; Row 2 alle 11 Links flach, kein Dropdown |

