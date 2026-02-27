

# User-Accounts und Watchlist implementieren

## Uebersicht
Vollstaendiges Authentifizierungssystem mit Benutzerprofilen und Watchlist-Funktion. Nutzer koennen sich registrieren, einloggen und Aktien per Stern-Button zur Watchlist hinzufuegen.

---

## 1. Datenbank-Migrationen

**profiles-Tabelle:**
- `id` (UUID, Referenz auf auth.users)
- `display_name` (Text)
- `created_at` (Timestamp)
- RLS: Nutzer koennen nur eigenes Profil lesen/bearbeiten
- Trigger: Profil wird automatisch bei Registrierung erstellt

**watchlist-Tabelle:**
- `id` (UUID)
- `user_id` (UUID, Referenz auf auth.users)
- `symbol` (Text)
- `created_at` (Timestamp)
- Unique-Constraint auf (user_id, symbol)
- RLS: Nutzer koennen nur eigene Watchlist lesen/bearbeiten

## 2. Auth-Context

Neuer `AuthContext` in `src/contexts/AuthContext.tsx`:
- Session-Management mit `onAuthStateChange` Listener
- Funktionen: `signIn`, `signUp`, `signOut`, `resetPassword`
- User-State global verfuegbar

## 3. Auth-Seite (`/auth`)

Neue Seite `src/pages/AuthPage.tsx`:
- Umschaltbare Login/Registrierung-Formulare
- E-Mail + Passwort Eingabe
- Optional: Anzeigename bei Registrierung
- Link zu "Passwort vergessen"
- Weiterleitung nach erfolgreichem Login

## 4. Passwort-Zuruecksetzen (`/reset-password`)

Neue Seite `src/pages/ResetPasswordPage.tsx`:
- Formular fuer neues Passwort
- Erkennt Recovery-Token aus URL

## 5. Watchlist-Hook

Neuer Hook `src/hooks/useWatchlist.ts`:
- `useWatchlist()`: Laedt alle Symbole der Watchlist
- `useToggleWatchlist()`: Hinzufuegen/Entfernen mit 3-Sekunden-Cooldown
- `useIsInWatchlist(symbol)`: Prueft ob Symbol gespeichert ist

## 6. Stern-Komponente

Neue Komponente `src/components/WatchlistStar.tsx`:
- Lucide Star-Icon (leer oder gelb gefuellt)
- Klick toggelt Watchlist-Eintrag
- 3-Sekunden-Cooldown (Button deaktiviert)
- Tooltip mit Status
- Nicht eingeloggt: Weiterleitung zu `/auth`

## 7. Watchlist-Seite (`/watchlist`)

Neue Seite `src/pages/WatchlistPage.tsx`:
- Liste aller gespeicherten Aktien mit Kursdaten
- Links zur jeweiligen Aktien-Detailseite
- Stern zum Entfernen direkt in der Liste

## 8. Integration in bestehende Komponenten

**StockDetail.tsx:**
- WatchlistStar neben dem Firmennamen einbauen

**Header.tsx:**
- Login/Logout-Button rechts
- Watchlist-Link in Navigation (wenn eingeloggt)

**App.tsx:**
- AuthProvider um die App wrappen
- Neue Routen: `/auth`, `/watchlist`, `/reset-password`

---

## Technische Details

### Datenbank-SQL

```sql
-- profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- watchlist
CREATE TABLE public.watchlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, symbol)
);
ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users select own watchlist" ON public.watchlist FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own watchlist" ON public.watchlist FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own watchlist" ON public.watchlist FOR DELETE USING (auth.uid() = user_id);
```

### Reihenfolge der Implementierung
1. Datenbank-Migrationen ausfuehren (profiles + watchlist)
2. AuthContext erstellen
3. AuthPage + ResetPasswordPage erstellen
4. useWatchlist Hook erstellen
5. WatchlistStar Komponente erstellen
6. WatchlistPage erstellen
7. StockDetail, Header, App.tsx anpassen

### Neue Dateien
- `src/contexts/AuthContext.tsx`
- `src/pages/AuthPage.tsx`
- `src/pages/ResetPasswordPage.tsx`
- `src/pages/WatchlistPage.tsx`
- `src/hooks/useWatchlist.ts`
- `src/components/WatchlistStar.tsx`

### Geaenderte Dateien
- `src/App.tsx` (AuthProvider + Routen)
- `src/components/Header.tsx` (Login/Logout + Watchlist-Nav)
- `src/pages/StockDetail.tsx` (Stern einbauen)

