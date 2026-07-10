## Plan: GitHub-Repo öffentlich machen — Keys absichern

### Ist-Zustand (wichtig zu wissen)

Ich habe das Repo geprüft. **Alle echten API-Keys sind bereits sicher** und niemals im Code:

- **Sensible Keys** (`FINNHUB_API_KEY`, `ALPHA_VANTAGE_API_KEY`, `TWELVE_DATA_API_KEY`, `MASSIVE_API_KEY_*`, `SIMFIN_API_KEY`, `EULERPOOL_API_KEY`, `FRED_API_KEY`, `WORLD_NEWS_API_KEY`, `LOVABLE_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) liegen **ausschließlich als Edge-Function-Secrets auf dem Backend**. Sie werden nur via `Deno.env.get()` in den Server-Funktionen (`supabase/functions/*`) gelesen. Sie tauchen **nirgends im Repo** auf.
- **Im `.env` liegen nur** `VITE_SUPABASE_URL` und `VITE_SUPABASE_PUBLISHABLE_KEY` (Anon Key). Diese sind **per Design öffentlich** — sie gehen im Vite-Build ohnehin in jedes Browser-Bundle und sind auf jeder Webseite via DevTools sichtbar. Row Level Security schützt die DB, nicht Geheimhaltung dieser Keys. Supabase nennt sie deshalb explizit "publishable".

**Fazit:** Es gibt aktuell keine "klaubaren" Keys im Repo. Trotzdem härten wir das Ganze für den Public-Release ab.

### Maßnahmen

1. **`.env` aus Git ausschließen**
   `.gitignore` um `.env` und `.env.local` erweitern. Die Datei wird lokal/in Lovable weiter genutzt, landet aber nicht mehr im Public-Repo.

2. **`.env.example` anlegen**
   Als Vorlage für Forks — enthält die Variablennamen ohne Werte:
   ```
   VITE_SUPABASE_URL=
   VITE_SUPABASE_PUBLISHABLE_KEY=
   VITE_SUPABASE_PROJECT_ID=
   VITE_STOCK_API_URL=
   ```

3. **Fallback im Supabase-Client**
   Aktuell crasht die App still, wenn `.env` fehlt (siehe `src/integrations/supabase/client.ts`). Ich ergänze einen aussagekräftigen Runtime-Check, damit Forks eine klare Fehlermeldung bekommen statt einer weißen Seite.

4. **README-Abschnitt "Setup / Fork"**
   Kurze Anleitung: eigenes Supabase-Projekt anlegen, `.env` aus `.env.example` erstellen, Edge-Function-Secrets im Supabase-Dashboard setzen. So kann jemand deinen Code nutzen, ohne deine Keys zu bekommen.

5. **Bereits-committete Keys nach Public-Schaltung**
   Da der Anon Key ohnehin öffentlich sein darf, ist ein Force-Push/History-Rewrite nicht nötig. Falls du zusätzlich Paranoia-Level willst, kannst du nach dem Public-Machen den Anon Key im Supabase-Dashboard rotieren — Lovable schreibt dann automatisch neue Werte ins `.env`.

### Was NICHT geändert wird

- Keine funktionale Änderung an Edge Functions, API-Calls, Auth oder Datenfluss.
- Die App läuft in Lovable exakt wie vorher — `.env` bleibt lokal vorhanden.
- Die Backend-Secrets bleiben unangetastet (sie waren nie im Repo).

### Dateien

| Datei | Änderung |
|---|---|
| `.gitignore` | `.env`, `.env.local` ergänzen |
| `.env.example` | Neu — Vorlage ohne Werte |
| `src/integrations/supabase/client.ts` | Klarer Missing-Env-Check |
| `README.md` | Setup-Abschnitt für Forks |
