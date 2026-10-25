# Amflow PX Setup Cockpit — V1.1

**Funktionierende Ausgangsbasis:** ausschließlich der vom Nutzer bereitgestellte Repository-Export `amflow-px-setup V1.01.zip` (V1.0.1). Die vorliegende V1.1 ist die bereinigte Fassung mit **Huschel App Speicher** als einziger manueller Speicheroberfläche. Freigabe als neuer MASTER erst nach deinem Praxistest.

## 1. Was die App macht

Das PX Setup Cockpit ist eine statische, mobilfähige GitHub-Pages-Web-App für das Amflow PX Carbon Pro 2026 mit Avinox M2S. Sie liest **keine** realen Bike-Einstellungen aus und schreibt nichts in die Avinox Ride App. Alle Änderungen am Bike werden manuell durchgeführt.

- **Vergleich:** Drei editierbare Profile: „Mein Bike“ (Ist-Werte), „Waldtrail“ und „Allgäu Berge“ (Empfehlungswerte). Motorunterstützung, Gabel, Dämpfer, Reifen, Akku und Systemoptionen nebeneinander; Filter und Anzeige der Unterschiede. Reset setzt nur die Empfehlungen zurück.
- **Testfahrten:** Fahrten erfassen, bearbeiten, löschen, vergleichen – jeweils mit Datum, Strecke, Distanz, Höhenmetern, Akku, Untergrund, Bewertungen, Notizen und unveränderlichem Schnappschuss der zum Test verwendeten Profilwerte.
- **Vergleich als CSV:** Export für die weitere Auswertung.
- **Hilfe:** Kurzanleitung direkt in der App.
- **PWA:** Home-Screen-/Startbildschirm-App mit Icons, Manifest und Service Worker für Offline-Fallback nach dem ersten Besuch.
- **Automatische lokale Speicherung:** Änderungen an Bike-Werten und Testfahrten werden unmittelbar im jeweiligen Browser gesichert.
- **Huschel App Speicher:** Über „☁ Speicher“ oben wird eine **eigene Ansicht mit Zurück-Button** geöffnet. Enthält Speicherampel, bestätigten Supabase-Anmeldestatus, privates GitHub Speichern/Laden, lokale Speicherung sowie JSON-Export/-Import.

## 2. Änderungen von V1.0.1 zu V1.1

**Entfernt:**
- alter Navigationsreiter **„Speichern & GitHub“**;
- direkte GitHub-API-Aufrufe im Browser und sämtliche Eingabefelder für GitHub-Nutzer, Repository, Branch und Personal Access Token;
- Speicherung eines alten GitHub-Tokens im `sessionStorage` (ein bereits vorhandener früherer Session-Token wird beim Start gelöscht);
- alter automatischer GitHub-Dateiabruf beim App-Start;
- doppelte JSON-Buttons außerhalb der zentralen Speicherseite;
- veraltete Hilfe-/Token-Anweisungen und der Hinweis auf die frühere Synchronisierung.

**Unverändert:**
- alle Bike-Einstellwerte, drei Profile, Testfahrtenfelder, Schnappschüsse, Berechnungen, Filter, CSV-Export;
- lokales Datenmodell (`schemaVersion: 1`) und bestehender LocalStorage-Schlüssel;
- ursprünglicher Look, Farben, PWA-Icons und Hauptnavigation der übrigen Reiter;
- vollständige Huschel-Speicherfunktionen, Supabase-Auto-Login, private GitHub-Verbindung, Konflikt- und Versionsschutz.

**Aktualisiert:** sichtbare Versionsnummer in der App und Service-Worker-Cache auf V1.1, damit keine alte Oberfläche aus dem PWA-Cache geladen wird.

## 3. Enthaltene Dateien — genau diese gehören ins öffentliche App-Repository

```text
amflow-px-setup/           ← Inhalt in das Repository-Stammverzeichnis hochladen
├── index.html              Startseite, Vergleich, Testfahrten, Hilfe und separater Speicherzugang
├── app.js                  Bike-Logik, Berechnung, Fahrtenbuch, automatische lokale Speicherung, Datenbrücke
├── styles.css              Bisherige App-Gestaltung
├── huschel-amflow-speicher.js    Huschel-Speichermodul, Supabase und private GitHub-Anbindung
├── huschel-amflow-speicher.css   Darstellung der separaten Speicherseite
├── sw.js                   PWA-Service Worker (Cache V1.1)
├── manifest.webmanifest    PWA-Metadaten
├── assets/
│   ├── icon.svg            Browser-Favicon
│   ├── icon-192.png        Startbildschirm-Icon
│   └── icon-512.png        PWA-Icon
└── README.md               Diese Anleitung
```

**Nicht mehr für den Betrieb benötigt und bewusst NICHT in V1.1 enthalten:** `data/bike-setup.json`, `Amflow_PX_Setup_2026-10-12.json`, `README_HUSCHEL_SPEICHER.txt`, `SUPABASE_ALLOWLIST_PATCH.txt`, alte `.gitattributes`, `.DS_Store`, `__MACOSX` und der mitexportierte `.git/`-Ordner. Die Datei `data/bike-setup.json` war **nur die frühere öffentliche GitHub-Sync-Datei**. Ihre frühere Version ist in der ursprünglich hochgeladenen ZIP enthalten; lösche dein Original-Backup nicht vorschnell.

Die CSS-Datei kann aus Kompatibilitätsgründen noch wirkungslose alte Klassennamen enthalten; diese beeinflussen keine Funktion und wurden bewusst nicht ausgeräumt, damit die Darstellung unverändert bleibt.

## 4. Bestehendes Repository sicher auf V1.1 umstellen

1. **Vorher sichern:** Die aktuelle `amflow-px-setup V1.01.zip` als Archiv aufbewahren. Zusätzlich in der **derzeit funktionierenden App** ein frisches JSON-Backup über „☁ Speicher → JSON erstellen“ herunterladen und kontrollieren. Falls ältere Daten ausschließlich in `data/bike-setup.json` liegen, diese Datei ebenfalls archivieren.
2. **Neues Paket entpacken:** In `Amflow_PX_Setup_V1.1` liegen genau die oben aufgeführten Dateien. **Nur deren Inhalt** in die Wurzel des bestehenden öffentlichen GitHub-Repositories `amflow-px-setup` hochladen; keinen zusätzlichen verschachtelten Ordner anlegen.
3. **Ersetzen:** Vorhandene gleichnamige App-Dateien überschreiben. `index.html`, `app.js`, beide Huschel-Dateien, `sw.js`, `manifest.webmanifest`, `styles.css` und alle drei Icons gehören zusammen.
4. **Alte Dateien entfernen:** Erst nachdem du die neue Version auf GitHub Pages geöffnet und überprüft hast, kannst du die nicht mehr benötigten Dateien aus **der aktuellen Repository-Version** löschen: insbesondere `data/bike-setup.json`, `Amflow_PX_Setup_2026-10-12.json`, `README_HUSCHEL_SPEICHER.txt`, `SUPABASE_ALLOWLIST_PATCH.txt`. Leeren `data/`-Ordner gibt es bei Git ohnehin nicht. `.git/` gehört niemals als Upload zum öffentlichen Pages-Inhalt; falls du das Repository lokal mit Git verwaltest, behalte dort den lokalen `.git/`-Ordner für die Versionsverwaltung.
5. **GitHub Pages prüfen:** Repository-Einstellung `Settings → Pages` weiter auf `Deploy from a branch → main → /(root)` lassen. Die öffentliche URL bleibt dieselbe.
6. **Cache aktualisieren:** Browserseite neu laden. Bei einer installierten PWA eventuell einmal ganz schließen und neu öffnen. `sw.js` verwendet jetzt einen eigenen V1.1-Cache und entfernt alte `px-setup-...`-Caches bei Aktivierung.
7. **Echten Speicher prüfen:** Auf „☁ Speicher“ klicken: **Angemeldet** muss grün sein (gegebenenfalls einmalig anmelden); „GitHub Laden“ aufrufen, die gespeicherten Daten kontrollieren und bei Bedarf erneut speichern. Erst nachdem das funktioniert, das frühere App-/Daten-Backup als Archiv ablegen.

**Wichtig für Daten und Datenschutz:** Das Löschen einer Datei aus dem aktuellen öffentlichen GitHub-Repository entfernt sie **nicht aus der bisherigen Commit-Historie**. Falls `data/bike-setup.json` sensible Informationen enthält, ist die alte Git-Historie gesondert zu beurteilen. Die V1.1 schreibt nichts mehr in diese öffentliche Datendatei und **ändert keine GitHub-Repository-Historie**.

## 5. Neue Speicherung – Infrastruktur

| Komponente | Wert / Zweck |
| --- | --- |
| Öffentliche App | GitHub Pages im Repository `amflow-px-setup` (Programmcode, keine privaten Cloud-Daten) |
| Supabase-Projekt | `huschel-speicher-pilot` |
| Supabase URL | `https://qijordwpbwwbizfcslrv.supabase.co` |
| Edge Function | `github-app-storage` |
| Privates Daten-Repository | `phusch/huschel-app-data` |
| Privater Speicherpfad | `amflow-px-setup/data.json` |
| Geheimnis | `GITHUB_TOKEN` ausschließlich als geschütztes Supabase Secret; **niemals in die Browser-App** |
| Supabase-Zugang | E-Mail/Passwort beim ersten Mal, danach automatische Sitzungswiederherstellung auf dem Gerät |

**Supabase muss für V1.1 nicht erneut eingerichtet oder aktualisiert werden**, sofern dein Huschel-Speichermodul V1.0.1 bereits erfolgreich speichern und laden konnte. Insbesondere muss die App-ID `amflow-px-setup` in der erlaubten Liste der bestehenden Edge Function enthalten sein.

## 6. Speicherbedienung im Alltag

1. **Bike bearbeiten:** Jede Änderung wird automatisch lokal gespeichert. Offline-Bearbeitung ist für die Bike-Daten grundsätzlich möglich.
2. **Speicherseite öffnen:** Über den Symbolbutton „☁ Speicher“ oben. Die große Ampel bezieht sich auf die private GitHub-Sicherung, der grün hinterlegte **Anmeldestatus** auf die Supabase-Sitzung.
3. **GitHub Laden:** Liest den aktuellen privaten Speicherstand und seine Revision. Wenn sich Daten unterscheiden, fragt die App **vor** dem Ersetzen deiner aktuellen Bike-Daten nach. Ein Laden ersetzt die Profile **und** das Fahrtenbuch; erst nach Bestätigung.
4. **GitHub Speichern:** Vorher einmal „GitHub Laden“ wählen, damit die aktuelle Dateiversion bekannt ist. Änderungen werden nur manuell hochgeladen. Die Edge Function verhindert ungeprüftes Überschreiben eines zwischenzeitlich geänderten GitHub-Stands.
5. **Lokal Speichern/Laden:** Gleicher Browserspeicher wie die bisherige App. Beim Laden abweichender Daten muss bestätigt werden.
6. **JSON erstellen/laden:** Unabhängiger Download/Import deiner vollständigen Profile und Testfahrten; gut als zusätzliches Backup und für eine Rückkehr auf ältere Stände.
7. **Zurück:** Schließt die Speicherseite, ohne die aktuelle Arbeitsansicht in der App neu zu laden.

### Was wird gespeichert?

Das JSON-Schema bleibt `schemaVersion: 1`: `profiles.current` (Mein Bike), `profiles.forest` (Waldtrail), `profiles.alpine` (Allgäu Berge), `rides[]` (inkl. Snapshots), `meta` sowie die Modell-/Bike-Basisdaten. Im Browser unter `localStorage`-Schlüssel `amflow-px-setup-data-v1`.

**Der frühere direkte GitHub-Speicherweg `data/bike-setup.json` wird nicht mehr gelesen und nicht mehr beschrieben.** Die privaten Daten gehören in das separate Repository `huschel-app-data`.

## 7. Sicherheit

- Kein GitHub-Token im HTML/JavaScript, LocalStorage, SessionStorage oder JSON-Backup. Ein eventuell früher im Browser-SessionStorage abgelegter Legacy-GitHub-Token wird beim Start aus dieser Sitzung entfernt.
- Der **Supabase Publishable Key** ist kein Geheimnis; ein Supabase **Secret Key** oder GitHub-Token gehört niemals in eine Web-App.
- Anmeldung läuft mit Supabase Auth, wiederverwendeter und automatisch aktualisierter Sitzung. Das Passwort wird nicht dauerhaft abgelegt; „Abmelden“ beendet die Sitzung.
- Die Edge Function prüft die erlaubte Benutzer-ID und feste App-Pfade. Bereits geprüfte Cloud-Revisionsdaten dienen dem Konfliktschutz.
- Cloud-Speicherung ist **manuell**. Kein automatischer GitHub-Upload im Hintergrund.
- Auf einem anderen Gerät mit derselben App anmelden und erst den privaten GitHub-Stand prüfen/laden. Ein Gerät hat nicht automatisch denselben lokalen Speicher wie ein anderes.

## 8. Prüfung nach dem Update

- [ ] App startet und zeigt **V1.1**.
- [ ] Navigation hat genau **Vergleich | Testfahrten | Hilfe** (kein Reiter „Speichern & GitHub“).
- [ ] Vergleich umfasst **Mein Bike / Waldtrail / Allgäu Berge** und alle bisherigen Werte.
- [ ] Filter „Nur Unterschiede“, Empfehlungs-Reset und CSV-Export funktionieren.
- [ ] Bestehende Testfahrten und Snapshots sind vorhanden; eine Fahrt lässt sich neu anlegen, bearbeiten und löschen.
- [ ] Eine Wertänderung bleibt nach Neuladen auf demselben Gerät erhalten.
- [ ] „☁ Speicher“ öffnet die separate Ansicht, „Zurück“ bringt dich ohne Datenverlust zurück.
- [ ] Supabase meldet sich automatisch wieder an; „Angemeldet“ wird grün angezeigt.
- [ ] „GitHub Laden“ sieht den bekannten privaten Stand; nach bewusster Prüfung funktioniert Speichern und Laden.
- [ ] JSON-Export/-Import und lokale Speichermethoden funktionieren.
- [ ] PWA startet nach Neuinstallation bzw. Cache-Aktualisierung weiter.

## 9. Fehlerbehebung

- **Alter Reiter sichtbar:** Seite/PWA neu laden; eventuell alte PWA-Instanz schließen, Cache-Aktivierung abwarten. `sw.js` muss ebenfalls auf V1.1 aktualisiert sein.
- **Anmeldung nicht grün:** Onlineverbindung prüfen, einmalig neu anmelden; eventuell sind Browserdaten gelöscht oder die Sitzung abgelaufen.
- **GitHub-Funktion antwortet mit App nicht freigegeben:** Supabase Edge Function muss `amflow-px-setup` in der serverseitigen Allowlist enthalten. Nicht an GitHub-Token im Browser experimentieren.
- **Versionskonflikt:** JSON-Backup der lokalen Daten erstellen, dann GitHub-Stand prüfen, bewusst auswählen. Kein stilles Überschreiben.
- **Offline:** Bike-Bearbeitung und lokal gespeicherte Daten können weiter funktionieren; für Anmeldung/GitHub-Aktionen ist eine Verbindung nötig.
- **Browserdaten gelöscht:** Lokale Daten sind dann ggf. weg; in der Speicherseite die letzte private GitHub-Sicherung oder ein JSON-Backup laden.

## 10. Technisches Änderungsprotokoll

| Datei | Änderung | Absichtlich unverändert |
| --- | --- | --- |
| `index.html` | Alten Sync-Reiter und doppelte Backupbuttons entfernt; Hilfe, Fußzeile und Anzeigeversion aktualisiert | Vergleich, Fahrtenbuch, separate Speicherseite und ihr Aufbau |
| `app.js` | Alte Token-/GitHub-Funktionen, alte Sync-Konfiguration und automatisches Legacy-Cloud-Laden entfernt; direktes JSON-Backup nun ausschließlich im Huschel-Modul | Bike-Datenmodell, Berechnung, Profile, Testfahrten, Auto-Lokal-Speichern, CSV und Huschel-Datenbrücke |
| `sw.js` | Cache von V1.0.1 auf V1.1 aktualisiert | Caching-/Offline-Mechanismus |
| `manifest.webmanifest` | Veraltete Beschreibung korrigiert | App-Name, Icons, Start-/Anzeigemodus, Farben |
| `README.md` | Komplett überarbeitete Installations-, Bedienungs- und Bereinigungsanleitung | — |
| `styles.css`, `huschel-amflow-speicher.js`, `huschel-amflow-speicher.css`, `assets/*` | **Dateien unverändert übernommen** | Gesamter Inhalt |

### Versionsstatus

V1.1 ist eine **Test-/Freigabeversion** auf Basis der am 25.10.2026 hochgeladenen aktuellen Repository-ZIP. Erst nach deiner ausdrücklichen Prüfung und Freigabe wird sie die neue MASTER-Version.
