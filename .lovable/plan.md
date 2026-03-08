

## Plan: Navigation komplett neu aufbauen

### Problem
Der Header ist vollgestopft: 5 Nav-Links + More-Dropdown + Search + Online-Status + MarketClock + Currency + Language + Theme + Notifications + Learn + User-Dropdown. Die Suchleiste hat kaum Platz und sekundaere Seiten sind versteckt.

### Neues Konzept

**Desktop Header (schlank, 3 Zonen):**

```text
┌─────────────────────────────────────────────────────────────────┐
│ [S] StoneStocks  │  [══════ Search Bar (breit) ══════]  │ ⚙ 🔔 👤│
│                  │                                       │       │
└─────────────────────────────────────────────────────────────────┘
│ Markets  Sentiment  Rankings  News  Screener  Portfolio  Watchlist  Tools ▾  │
└─────────────────────────────────────────────────────────────────────────────┘
```

- **Obere Zeile**: Logo links, prominente Suchleiste in der Mitte (immer sichtbar, kein Scroll-Trigger noetig), rechts nur Theme + Notifications + User-Icon
- **Untere Zeile**: Alle Hauptseiten als horizontale Tabs. "Tools" Dropdown fuer: Calculator, Compare, Glossary, Learn. MarketClock, Currency, Language, Online-Status wandern in den User-Dropdown oder Footer
- Die Suchleiste bekommt endlich genug Platz (flex-1, max-w-lg)

**Desktop Header Detail:**
- Zeile 1 (h-12): Logo | SearchBar (flex-1, max-w-lg, immer sichtbar) | ThemeToggle, NotificationBell, UserDropdown (mit Settings/Profile/Currency/Language/MarketClock drin)
- Zeile 2 (h-10): Alle 7 Hauptseiten als flache Links + "Tools" Dropdown (Calculator, Compare, Glossary, Learn)
- Kein Online/Offline Badge mehr im Header (unwichtig, stoert nur)
- Currency, Language, MarketClock in den User-Dropdown verschieben (oder in einen kleinen Footer-Bereich)

**Mobile (<768px):**
- Header: Logo + SearchBar + Hamburger (3 Elemente, sauber)
- BottomNav bleibt mit 5 Items (Markets, Sentiment, Rankings, Portfolio, Watchlist)
- Hamburger-Sheet zeigt ALLE Seiten gruppiert: Hauptseiten, Tools, Account

### Dateien

| Datei | Aenderung |
|---|---|
| `src/components/Header.tsx` | Komplett umgebaut: 2-Zeilen Desktop, schlanker Mobile |
| `src/components/BottomNav.tsx` | Keine Aenderung (bleibt wie ist) |

### Details

- Alle 13 Pages erreichbar: /, /sentiment, /rankings, /news, /screener, /portfolio, /watchlist, /calculators, /compare, /glossary, /learn, /profile, /settings
- Search bekommt `max-w-lg flex-1` und ist immer sichtbar (kein Scroll-basiertes Ein/Ausblenden mehr)
- Zweite Zeile nur auf Desktop (hidden auf mobile)
- User-Dropdown enthaelt: Profile, Settings, Watchlist, Currency-Toggle, Language-Toggle, MarketClock, Logout
- Nicht eingeloggt: Login-Button statt User-Dropdown

