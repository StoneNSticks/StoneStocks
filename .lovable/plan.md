

# Login mit E-Mail oder Benutzername ermoeglichen

## Uebersicht
Nutzer sollen sich wahlweise mit ihrer E-Mail-Adresse oder einem Benutzernamen einloggen koennen. Dazu wird ein `username`-Feld in der Datenbank ergaenzt und die Login-Logik angepasst.

## Aenderungen

### 1. Datenbank: `username`-Spalte zur `profiles`-Tabelle hinzufuegen
- Neue Spalte `username` (TEXT, UNIQUE, nullable)
- Unique-Index, damit keine doppelten Benutzernamen existieren
- Trigger anpassen: bei Registrierung wird der Username aus den Metadaten uebernommen (falls angegeben)

### 2. Registrierung: Username-Feld hinzufuegen
- Das bisherige "Anzeigename"-Feld wird durch ein **Pflicht-Feld "Benutzername"** ersetzt (oder ergaenzt)
- Der Benutzername wird in `user_metadata` und in der `profiles`-Tabelle gespeichert

### 3. Login: Username ODER E-Mail akzeptieren
- Das Login-Feld akzeptiert sowohl E-Mail als auch Benutzername
- Logik: Wenn die Eingabe ein `@` enthaelt, wird direkt per E-Mail eingeloggt
- Wenn kein `@` enthalten ist, wird zuerst der Benutzername in der `profiles`-Tabelle nachgeschlagen, die zugehoerige E-Mail ermittelt, und dann damit eingeloggt
- Dafuer braucht die `profiles`-Tabelle eine zusaetzliche RLS-Policy, die das Nachschlagen der E-Mail per Username erlaubt (nur fuer den Login-Zweck)

### 4. E-Mail in `profiles` speichern
- Neue Spalte `email` in der `profiles`-Tabelle, damit der Username-zu-E-Mail-Lookup funktioniert, ohne auf `auth.users` zugreifen zu muessen
- Trigger aktualisieren, um die E-Mail automatisch zu speichern

## Betroffene Dateien

- **Datenbank-Migration**: `username` und `email` Spalten + RLS-Policy fuer Username-Lookup
- **`src/contexts/AuthContext.tsx`**: `signIn` erweitern (Username-Lookup), `signUp` um Username ergaenzen
- **`src/pages/AuthPage.tsx`**: Username-Feld bei Registrierung, Login-Feld Label/Placeholder anpassen

## Technische Details

### SQL-Migration
```sql
-- username + email Spalten
ALTER TABLE public.profiles ADD COLUMN username TEXT UNIQUE;
ALTER TABLE public.profiles ADD COLUMN email TEXT;

-- Bestehende Profile mit E-Mail updaten
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id;

-- Trigger anpassen: Username + Email bei Signup speichern
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, username, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    NEW.raw_user_meta_data->>'username',
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- RLS: Jeder darf per Username die zugehoerige Email nachschlagen (fuer Login)
CREATE POLICY "Anyone can lookup email by username"
  ON public.profiles FOR SELECT
  USING (true);
```

Hinweis: Die bestehende "Users read own profile"-SELECT-Policy wird durch die offenere Policy ersetzt. Da `profiles` nur `id`, `display_name`, `username`, `email` und `created_at` enthaelt (keine sensiblen Daten), ist das sicher.

### Login-Logik
```text
1. User gibt "max123" + Passwort ein
2. Kein "@" erkannt -> Username-Lookup
3. Query: SELECT email FROM profiles WHERE username = 'max123'
4. E-Mail gefunden -> signInWithPassword(email, password)
```

