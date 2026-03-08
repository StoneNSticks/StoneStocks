## Plan: Community Section Redesign, Threaded Comments, Vote Toggle, Privacy Settings, Layout Changes

### 1. Database Changes

**Add `parent_id` column to `stock_comments**` for threaded replies:

```sql
ALTER TABLE stock_comments ADD COLUMN parent_id uuid REFERENCES stock_comments(id) ON DELETE CASCADE;
```

**Add DELETE policy to `stock_votes**` (currently missing, needed for vote toggle-off):

```sql
CREATE POLICY "Users delete own votes" ON stock_votes FOR DELETE USING (auth.uid() = user_id);
```

**Add `show_username` column to `profiles**` for privacy toggle:

```sql
ALTER TABLE profiles ADD COLUMN show_username boolean NOT NULL DEFAULT true;
```

**Add `comment_reply_alerts` column to `profiles**` for reply notification setting:

```sql
ALTER TABLE profiles ADD COLUMN comment_reply_alerts boolean NOT NULL DEFAULT false;
```

### 2. Combine SentimentVote + StockComments into one component

Create a new unified `**CommunitySection.tsx**` that merges both:

- Top: Bullish/Bearish vote bar (from SentimentVote)
- Below: Comment input + comment list (from StockComments)
- Clicking an already-selected vote (bullish/bearish) removes it (DELETE from stock_votes, reset to null)
- Username shown per comment, respecting the `show_username` privacy flag (fetch from profiles)
- Own comments get a trash icon with an AlertDialog confirmation ("Willst du diesen Kommentar wirklich loschen?")

### 3. Threaded Replies (Instagram-style)

- Comments with `parent_id = null` are top-level
- Each top-level comment shows a "X Antworten" button if it has replies
- Clicking expands/collapses child comments (collapsible, indented)
- Reply button on each comment sets the input to reply mode (shows "Antwort an @username" badge above input)
- Child comments are fetched together with parents (single query, client-side grouping)

### 4. Settings Page Updates

Add two new sections to SettingsPage:

**Privacy & Security section** (new, with Shield icon):

- "Benutzername in Kommentaren anzeigen" toggle (writes to profiles.show_username)

**Notifications section** (extend existing):

- "Benachrichtigung bei Antworten auf eigene Kommentare" toggle (writes to profiles.comment_reply_alerts)

### 5. AnalystConsensus 12-Month History Fix

The `recommendation` data from Finnhub sometimes returns fewer than 12 entries. The code `slice(0, 12)` is correct but if the API only sends 4 months, that's all we get. Fix: show a note like "Daten fur X Monate verfugbar" when fewer than 12 entries exist. Also check if the recommendation data in the edge function is being truncated. The chart XAxis tick rendering may also hide labels due to space; will adjust `interval={0}` and angle ticks to show all months.

### 6. Main Page Layout Restructure

Remove the 3-column "Market Pulse Row" (SentimentGauge + SectorPerformance + QuickActions). Instead:

- Move **SentimentGauge** into the MarketOverview area as a compact inline element
- Move **Quick Actions** links into the existing header navigation or remove (redundant with new nav dropdown)
- Keep **SectorPerformance** as a standalone card, place it between News/TopCompanies and Commodities

### 7. Add SectorPerformance to Market Pulse Page

Import and render `<SectorPerformance />` on MarketSentimentPage, placed after the Fear & Greed section alongside the heatmap.

### Files Changed


| File                                                                                         | Change                                                                                    |
| -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `src/components/CommunitySection.tsx`                                                        | New: unified vote + threaded comments                                                     |
| `src/components/SentimentVote.tsx`                                                           | Keep but mark as legacy (CommunitySection replaces it on stock pages)                     |
| `src/components/StockComments.tsx`                                                           | Keep but mark as legacy                                                                   |
| `src/pages/StockDetail.tsx`                                                                  | Replace SentimentVote + StockComments with single CommunitySection                        |
| `src/pages/SettingsPage.tsx`                                                                 | Add privacy toggle + comment reply alerts toggle                                          |
| `src/pages/Index.tsx`                                                                        | Restructure layout, remove 3-col pulse row                                                |
| `src/pages/MarketSentimentPage.tsx`                                                          | Add SectorPerformance component                                                           |
| `src/components/AnalystConsensus.tsx`                                                        | Fix XAxis interval, add "X months available" note                                         |
| DB migration außerdem soll auf der mainpage bei top companies nur die top 10 angezeit werden | Add parent_id, show_username, comment_reply_alerts columns + DELETE policy on stock_votes |
