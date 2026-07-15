## Plan: StoneStocks als Lovable Skill verfügbar machen

### Ziel

Ein Projekt-spezifischen Skill-Entwurf erstellen, der das Finanz-Domain-Wissen aus StoneStocks kapselt, damit der Skill im Lovable-Composer dieses Projekts unter „Skills" auftaucht und zukünftige Agenten ihn nutzen können.

### Wichtige Klarstellung

Skills leben in Lovable und erscheinen im Composer / Skill-Picker des Projekts. Sie können nicht auf externen Plattformen wie LinkedIn angezeigt werden. Sollte das Ziel tatsächlich LinkedIn-Integration sein, wäre das ein separater Connector-Task (kein Skill).

### Ausgangslage

- Projekt: StoneStocks (Vite/React SPA, Lovable Cloud/Supabase).
- Projekt-Memory enthält bereits umfangreiche Regeln zu Design, Architektur, Markt-Daten, Fear & Greed, Heatmap, Aktien-Kuratierung, Währungskonvertierung etc.
- Skills werden in `.agents/skills/{skill-name}/` als Draft angelegt und mit `skills--apply_draft` aktiviert.

### Schritte

1. **Skill-Prinzipien und Projekt-Memory lesen**
   - `knowledge://skill/skill-creator/references/principles.md`
   - `knowledge://skill/skill-creator/references/reference-skills.md`
   - `mem://index.md` und relevante Memory-Dateien zu Finanz-Wissen.

2. **Finanz-Domain-Wissen aus dem Projekt extrahieren**
   - Fear & Greed 10-Indikatoren-Modell und Gewichtung.
   - Aktien-Kuratierung: ETFs, Hebelprodukte, Zertifikate ausschließen.
   - Heatmap-Regeln: ~130 Unternehmen, Sektoren, statisches Grid.
   - Market-Data-Flow: Yahoo Finance (Kurse), Finnhub (Meta), 12h Stale-Cache.
   - Währungskonvertierung USD/EUR globaler Toggle.
   - Learn/Glossary: 35 Kapitel, fuzzy Suche, Synonyme.

3. **Skill-Draft anlegen**
   - Verzeichnis: `.agents/skills/stonestocks-financial-domain/`
   - `SKILL.md` mit:
     - Frontmatter: `name`, `description`, `type: reference`
     - Kurzbeschreibung, wann die Skill greift.
     - Kernregeln aus Schritt 2.
     - Verweis auf `mem://index.md` für Details.
   - Optional `references/` mit ergänzenden Text-Dateien, falls die Regeln zu umfangreich für eine Datei werden.

4. **Skill aktivieren**
   - `skills--apply_draft` mit Pfad `.agents/skills/stonestocks-financial-domain` aufrufen.
   - Nach erfolgreicher Aktivierung ist der Skill im Projekt-Composer verfügbar.

5. **Validierung**
   - Prüfen, ob `SKILL.md` syntaktisch korrekt ist und die Frontmatter den Vorgaben entspricht.
   - Sicherstellen, dass keine sensitiven Daten (API-Keys, Service-Role-Key) im Skill-Text landen.

### Dateien

| Datei | Zweck |
| --- | --- |
| `.agents/skills/stonestocks-financial-domain/SKILL.md` | Hauptskill-Datei mit Frontmatter und Domain-Wissen |
| `.agents/skills/stonestocks-financial-domain/references/*.md` | Optionale vertiefende Referenzen |

### Was nicht passiert

- Keine funktionale Code-Änderung an der App.
- Keine API-Keys oder Secrets werden im Skill gespeichert.
- Keine LinkedIn-Veröffentlichung (das ist kein Skill-Feature).