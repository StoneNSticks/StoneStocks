

# Verbleibende Phasen -- Status und Implementierungsplan

## Bereits erstellte, aber NICHT integrierte Komponenten

Diese 7 Komponenten existieren als Dateien, sind aber noch nicht in StockDetail oder andere Seiten eingebunden:

| Komponente | Ziel-Seite |
|---|---|
| OptionsChainViewer | StockDetail |
| ShortInterestCard | StockDetail |
| VolumeProfile | StockDetail |
| EarningsWhisper | StockDetail |
| SeasonalityChart | StockDetail |
| MonteCarloFairValue | StockDetail |
| CorrelationMatrix | ComparePage |
| DividendIncomeTracker | PortfolioPage |
| AchievementBadges | ProfilePage |

---

## Verbleibende Phasen (nicht implementiert)

### Batch A: Integration bestehender Komponenten (9 Integrationen)
Alle oben genannten Komponenten in ihre Zielseiten einbinden.

### Batch B: AI-Features (49-56)
- **49 AI Portfolio Review** -- Button auf PortfolioPage, ruft Edge Function mit Positionen auf
- **50 AI Earnings Preview** -- Vor-Earnings KI-Analyse auf StockDetail
- **51 AI News Digest** -- Tages-Zusammenfassung auf NewsPage via Edge Function
- **52 AI Risk Assessment** -- Risk-Score Card auf StockDetail
- **53 AI Sector Rotation** -- Sektor-Empfehlungen auf MacroDashboard
- **54 NLP Screener** -- Textfeld auf ScreenerPage, das per AI Filter-Kriterien parst
- **55 AI Technical Analysis** -- Chartmuster-Erkennung auf StockDetail
- **56 AI Competitor Analysis** -- Automatischer Peer-Vergleich auf StockDetail

### Batch C: Screener & Rankings (57-62)
- **57 Advanced Screener Filters** -- Sektor, Land, Dividende, Momentum-Filter
- **58 Custom Screener Presets** -- Speichern/Laden in localStorage
- **59 Screener Alerts** -- Alert wenn neue Aktie Kriterien erfuellt
- **60 Magic Formula** -- Greenblatt-Ranking berechnen
- **61 Piotroski F-Score** -- F-Score Berechnung
- **62 Momentum Screener** -- 52W High/Low Scanner

### Batch D: Portfolio Erweiterungen (33-40)
- **33 Multi-Portfolio** -- Mehrere Portfolios in DB (neues `portfolios` Table)
- **34 Transaction History** -- Kauf/Verkauf-Log (neues `transactions` Table)
- **35 Tax Loss Harvesting** -- Verlust-Positionen identifizieren
- **36 Portfolio Rebalancing** -- Ziel-Allokation vs. Ist
- **37 Risk Analytics** -- VaR, Beta, Volatilitaet berechnen
- **39 Cost Basis** -- Durchschnittskosten aus Transaktionen
- **40 Portfolio Import** -- CSV Upload + Parsing

### Batch E: Social & Community (41-43, 46-47)
- **41 Public Profiles** -- Profil-Seite oeffentlich mit Stats
- **42 Forum erweitern** -- Upvotes auf Kommentare (neues `comment_votes` Table)
- **43 Follow System** -- Nutzer folgen (neues `follows` Table)
- **46 Trading Ideas** -- Trade-Ideen posten
- **47 Extended Polls** -- Markt-Sentiment Umfragen

### Batch F: Learning Erweiterungen (63, 65-68)
- **63 Interactive Tutorials** -- Step-by-Step mit Beispielen
- **65 Quiz Gamification** -- Punkte, Streaks, Levels
- **66 Video Integration** -- YouTube Embeds
- **67 Glossary Search** -- Autovervollstaendigung
- **68 Learning Paths** -- Strukturierte Lernpfade

### Batch G: Benachrichtigungen (69-70, 72-74)
- **69 Push Notifications** -- VAPID Web Push (teilweise vorhanden)
- **70 Email Notifications** -- Via Edge Function
- **72 Smart Alerts** -- AI-basierte ungewoehnliche Aktivitaet
- **73 Watchlist Digest** -- Woechentliche Zusammenfassung
- **74 Earnings Alert Automation** -- Auto-Alert vor Earnings

### Batch H: Daten & Export (75-80)
- **75 PDF Report** -- Client-seitige PDF-Generierung
- **76 Excel/CSV Export** -- Universaler Export-Button
- **77 API Dashboard** -- Rate Limit Anzeige
- **78 Data Refresh Controls** -- Cache-Info + Refresh Button
- **79 Historical Data Download** -- CSV Download
- **80 Watchlist Export/Import** -- JSON/CSV

### Batch I: Admin & System (81-83, 85-86)
- **81 Admin User Management** -- Nutzer-Liste mit Sperr-Option
- **82 Admin Analytics** -- Nutzungsstatistiken
- **83 Rate Limiting UI** -- API-Limit Warnung
- **85 Audit Log** -- Admin-Aktionen protokollieren
- **86 Feature Flags** -- Feature Toggles

### Batch J: Charts (26-28, 32)
- **26 Candlestick Chart** -- OHLC-Candlestick mit recharts
- **27 Drawing Tools** -- Trendlinien (Canvas-Overlay)
- **28 Multi-Timeframe** -- Nebeneinander-Vergleich
- **32 Point & Figure** -- Alternative Chartdarstellung

### Batch K: Performance & Technik (87-92)
- **87 SW Caching** -- Offline-Cache fuer Aktien
- **88 Image Lazy Loading** -- Native lazy loading
- **89 Virtual Scrolling** -- react-virtual fuer Listen
- **90 Prefetching** -- Link-Prefetch
- **91 Bundle Splitting** -- bereits via lazy()
- **92 Error Tracking** -- Sentry-artige Fehler-Logs

### Batch L: Spezial (94-95, 98-100)
- **94 Screener Heatmap** -- Ergebnisse als Treemap
- **95 Macro Dashboard Pro** -- Erweiterte Makro-Charts
- **98 Telegram Bot** -- Alerts via Telegram
- **99 Multi-Language** -- FR, ES, TR
- **100 PWA Optimierung** -- Capacitor-aehnlich

### Bereits abgedeckt (16 nicht machbar)
- **16 WebSocket** -- Erfordert kostenpflichtigen Echtzeit-Feed, nicht umsetzbar mit aktuellen APIs

---

## Implementierungsreihenfolge

| Prioritaet | Batch | Phasen | Aufwand |
|---|---|---|---|
| 1 | A: Integration | 9 Komponenten einbinden | Klein |
| 2 | B: AI Features | 49-56 | Mittel |
| 3 | C: Screener | 57-62 | Mittel |
| 4 | D: Portfolio | 33-40 | Gross (DB) |
| 5 | H: Export | 75-80 | Klein |
| 6 | E: Social | 41-43, 46-47 | Gross (DB) |
| 7 | J: Charts | 26-28, 32 | Mittel |
| 8 | F: Learning | 63, 65-68 | Klein |
| 9 | G: Notifications | 69-74 | Mittel |
| 10 | I: Admin | 81-86 | Mittel |
| 11 | K: Performance | 87-92 | Klein |
| 12 | L: Spezial | 94-100 | Gross |

---

## Technische Details

### Neue DB-Tabellen (Batches D, E, I)
- `portfolios` (id, user_id, name, created_at)
- `transactions` (id, user_id, portfolio_id, symbol, type, shares, price, date)
- `comment_votes` (id, user_id, comment_id, vote)
- `follows` (id, follower_id, following_id)
- `audit_log` (id, admin_id, action, details, created_at)
- `feature_flags` (id, flag_name, enabled, created_at)

### Neue Edge Functions (Batches B, G)
- `ai-portfolio-review` -- Portfolio-Analyse
- `ai-earnings-preview` -- Earnings-Vorschau
- `ai-news-digest` -- News-Zusammenfassung
- `ai-risk-assessment` -- Risiko-Score
- `smart-alerts` -- Ungewoehnliche Aktivitaet erkennen

### Dateien pro Batch
**Batch A:** Nur Edits an StockDetail.tsx, ComparePage.tsx, PortfolioPage.tsx, ProfilePage.tsx
**Batch B:** 8 neue Komponenten + 5 Edge Functions
**Batch C:** Edits an ScreenerPage.tsx + 3 neue Komponenten
**Batch D:** 5 neue Komponenten + DB-Migrationen
**Batch H:** 4 neue Komponenten (PDFReport, ExportButton, etc.)

Ich starte mit Batch A (Integration) und arbeite mich durch alle Batches.

