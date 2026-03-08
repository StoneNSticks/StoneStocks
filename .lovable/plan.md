

# Plan: Navigation konsolidieren + AI Chat reparieren

## Problem 1: Zu viele Nav-Items
Die Navigationsleiste hat 22 Eintraege -- viel zu viele. Viele Seiten sind besser als Features auf bestehenden Seiten aufgehoben.

## Konsolidierungs-Vorschlag

### Navigation BEHALTEN (8 Hauptseiten):
| Nav-Item | Beschreibung |
|---|---|
| Markets (/) | Startseite |
| Sentiment | Marktsentiment |
| Rankings | Rankings + Heatmap |
| News | Nachrichten |
| Screener | Screener + Magic Formula etc. |
| Portfolio | Portfolio + Paper Trading |
| Watchlist | Watchlist |
| Learn | Learning + Glossar |

### Navigation ENTFERNEN und als Features integrieren:

| Seite entfernen | Wohin verschieben |
|---|---|
| `/calculators` | Button/Tab auf der Startseite oder StockDetail |
| `/compare` | Bleibt als Route, aber aus Nav entfernen (erreichbar via StockDetail-Link) |
| `/backtest` | Tab in Portfolio-Seite |
| `/ai-chat` | Floating Chat-Button (global verfuegbar) oder Tab in Portfolio |
| `/dashboard` | Bleibt als Route, aus Nav entfernen (Link im User-Dropdown) |
| `/crypto` | Tab/Section auf Markets-Startseite |
| `/forex` | Tab/Section auf Markets-Startseite |
| `/bonds` | Tab/Section auf Markets-Startseite |
| `/ipo` | Tab auf Markets-Startseite |
| `/economic-calendar` | Section auf Macro-Dashboard oder Markets |
| `/paper-trading` | Tab in Portfolio-Seite |
| `/leaderboard` | Section auf Rankings-Seite |
| `/macro` | Aus Nav entfernen (Link auf Startseite) |
| `/glossary` | Tab auf Learn-Seite |

### Neue Nav-Struktur (2 Gruppen):
**Main:** Markets, Sentiment, Rankings, News, Screener, Portfolio, Watchlist, Learn
**Keine "Tools"-Gruppe mehr** -- alles integriert.

## Problem 2: AI Chat funktioniert nicht
Die Edge Function `stock-chat` muss neu deployed werden. Der Netzwerk-Request zeigt "Failed to fetch", was bedeutet die Function ist nicht aktiv. Fix: Edge Function deployen.

## Implementierung

### Schritt 1: Header Navigation reduzieren
- `navItems` auf 8 Hauptseiten kuerzen
- Alle Tool-Items aus der Nav entfernen
- User-Dropdown: Links zu Dashboard, Compare, Macro hinzufuegen

### Schritt 2: Seiten als Features integrieren
- **Index.tsx**: Tabs fuer Markets/Crypto/Forex/Bonds/IPOs hinzufuegen
- **PortfolioPage.tsx**: Tabs fuer Portfolio/Paper Trading/Backtest
- **RankingsPage.tsx**: Leaderboard-Section unten anfuegen
- **LearnPage.tsx**: Glossar als Tab integrieren

### Schritt 3: AI Chat als globaler Floating Button
- Chat-Widget als Floating-Button (unten rechts) auf allen Seiten
- `/ai-chat` Route bleibt bestehen fuer Vollbild-Ansicht
- Aber nicht mehr in der Hauptnavigation

### Schritt 4: AI Chat Edge Function deployen
- `stock-chat` Edge Function neu deployen damit der Chat funktioniert

### Schritt 5: BottomNav (Mobile) aktualisieren
- Bleibt bei 5 Items: Home, Sentiment, Rankings, Portfolio, Watchlist

