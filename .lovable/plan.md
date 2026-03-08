

# Plan: Mobile/Tablet Zoom-Sperre, Layout-Optimierung & Seiten-Überarbeitung

## 1. Zoom & Wischen deaktivieren

**`index.html`**: Viewport-Meta erweitern um `maximum-scale=1, user-scalable=no` und iOS-spezifische Touch-Action-Meta-Tags.

**`src/index.css`**: Globale CSS-Regeln hinzufügen:
- `touch-action: manipulation` auf `html` (verhindert Doppeltipp-Zoom)
- `-webkit-text-size-adjust: 100%` (verhindert Auto-Zoom bei Inputs)
- `overscroll-behavior: none` auf `body` (verhindert Pull-to-Refresh/Bounce)
- Input-Felder: `font-size: 16px` minimum (verhindert iOS Auto-Zoom bei Fokus)

## 2. Globale mobile Layout-Verbesserungen

**`src/index.css`**:
- Alle Tabellen/Karten: `overflow-x: auto` mit `-webkit-overflow-scrolling: touch`
- Kleinere Schriftgrößen auf `<640px` für dichte Datenanzeigen
- Konsistente `safe-area-inset` Padding für Notch-Geräte

**`src/components/Header.tsx`**:
- Kompaktere mobile Ansicht: Logo-Text immer verbergen unter `sm`, weniger Padding

**`src/components/BottomNav.tsx`**:
- Safe-Area-Inset für iPhone-Homebar (`pb-safe`)

## 3. Seiten-Überarbeitungen

### Index (Homepage)
- Responsivere Grid-Abstände, Touch-Targets mindestens 44px

### StockDetail
- Metriken-Grid: 2 Spalten auf Mobile statt 3-4
- Charts volle Breite, kein Overflow

### ScreenerPage
- Filter-Inputs als kompaktes Grid auf Mobile (2 Spalten)
- Tabellen-Rows mit größerem Tap-Target

### PortfolioPage
- Pie-Chart volle Breite auf Mobile
- Position-Cards statt Tabelle auf kleinen Screens

### WatchlistPage
- Grid/List-Toggle: Default = List auf Mobile
- Kompaktere Karten

### ComparePage
- Normalisierter Chart: volle Breite, kein horizontales Scrollen
- Stock-Cards: Stack vertikal auf Mobile

### NewsPage
- News-Karten: Bild links (klein) + Text rechts auf Mobile
- Kompaktere Kategorie-Badges

### MarketSentimentPage
- Gauge und Kacheln: 1 Spalte auf Mobile
- Heatmap: horizontaler Scroll mit Indikator

### GlossaryPage
- Letter-Filter: horizontaler Scroll-Strip statt Umbruch
- Kompaktere Einträge

### SettingsPage / ProfilePage
- Volle Breite Inputs auf Mobile, kein max-w Beschränkung

### AuthPage
- Card zentriert, max-w-sm, Touch-optimierte Buttons

### CalculatorPage
- Kategorie-Pills: horizontaler Scroll auf Mobile
- Input-Labels neben Feldern auf Desktop, darüber auf Mobile

### LearnPage
- TOC: Collapsible sidebar auf Desktop, Dropdown auf Mobile
- Sections: Volle Breite, größere Schrift für Fließtext

## 4. Eigene Ergänzungen (nach Ermessen)

- **Pull-to-Refresh Indikator**: Visueller Hinweis bei manuellem Seiten-Reload
- **Smooth Scroll Behavior**: `scroll-behavior: smooth` global
- **Focus-Visible Styling**: Bessere Keyboard-Navigation-Indikatoren
- **Skeleton Shimmer Animation**: Verbesserte Loading-States mit Shimmer-Effekt
- **Footer auf allen Seiten**: Einheitlicher Footer-Komponent der auf jeder Seite erscheint (aktuell fehlt er auf vielen Unterseiten)
- **Breadcrumbs auf Unterseiten**: Konsistente Navigation-Breadcrumbs auf Stock Detail, Commodity Detail etc.

## Technischer Ansatz

Dateien die geändert werden:
- `index.html` — Viewport Meta
- `src/index.css` — Globale mobile Styles, Touch-Action, Safe-Area
- `src/components/Header.tsx` — Mobile Kompakt-Modus
- `src/components/BottomNav.tsx` — Safe-Area Padding
- `src/pages/Index.tsx` — Grid-Abstände
- `src/pages/StockDetail.tsx` — Responsive Metriken
- `src/pages/ScreenerPage.tsx` — Mobile Filter-Layout
- `src/pages/PortfolioPage.tsx` — Mobile Cards
- `src/pages/WatchlistPage.tsx` — Kompakte Ansicht
- `src/pages/ComparePage.tsx` — Stack Layout
- `src/pages/NewsPage.tsx` — Mobile News-Cards
- `src/pages/MarketSentimentPage.tsx` — Mobile Grids
- `src/pages/GlossaryPage.tsx` — Scroll-Filter
- `src/pages/SettingsPage.tsx` — Volle Breite
- `src/pages/ProfilePage.tsx` — Mobile Form
- `src/pages/AuthPage.tsx` — Touch-optimiert
- `src/pages/CalculatorPage.tsx` — Mobile Tabs
- `src/pages/LearnPage.tsx` — Mobile TOC
- Neuer `src/components/Footer.tsx` — Wiederverwendbarer Footer

