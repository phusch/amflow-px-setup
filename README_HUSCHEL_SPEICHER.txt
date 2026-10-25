AMFLOW PX SETUP COCKPIT – V1.0.1 HUSCHEL SPEICHER (TEST)
=========================================================

Ausgangsbasis: ausschließlich die vom Nutzer hochgeladene `amflow-px-setup.zip`
(Amflow PX Setup Cockpit V1.0.0).

NEU:
- Ein Symbolbutton im Kopfbereich öffnet eine separate Speicherseite.
- Grüne Anmeldung mit Supabase Auth, Auto-Login und expliziter Abmeldung.
- GitHub Speichern/Laden im privaten phusch/huschel-app-data:
  amflow-px-setup/data.json
- GitHub-Revisionsschutz über SHA, keine stillen Überschreibungen.
- Lokale Speicherung/Laden und JSON-Backup-/Import im neuen Modul.
- Speichern/Laden der ECHTEN Daten: Mein Bike, Waldtrail, Allgäu Berge,
  Einstellungen, Testfahrten sowie deren Profil-Schnappschüsse.

VOR DEM GITHUB-TEST:
- Die `SUPABASE_ALLOWLIST_PATCH.txt` lesen und die eine App-ID
  in der BEREITS vorhandenen Edge Function ergänzen. Sonst meldet der
  neue Speicher `App nicht freigeschaltet`.
- Das öffentliche `amflow-px-setup`-Repository bleibt unberührt, bis du
  selbst die neue Version veröffentlichst.

TESTABLAUF:
1) Die bisherige App vor dem Update ggf. als JSON sichern.
2) Neues ZIP in eigenem Testzweig/-repo prüfen; zum Veröffentlichen den
   INHALT des Hauptordners hochladen (nicht .git oder __MACOSX).
3) Den neuen Speichern-Button im Kopfbereich öffnen.
4) Einmal mit Supabase anmelden, danach bleibt die Sitzung im selben Browser.
5) Vor dem ersten GitHub Speichern einmal GitHub Laden; wenn die Datei
   fehlt, wird klar auf den ersten Speichervorgang hingewiesen.
6) GitHub Speichern, dann einen Testwert in Mein Bike ändern,
   GitHub Laden wählen, bewusst bestätigen und Wert kontrollieren.
7) Auf Mac/iPhone getrennt überprüfen.

ACHTUNG – VORHANDENER ALTER SPEICHERWEG:
Die bisherige direkte GitHub-Synchronisierung im bestehenden Reiter
`Speichern & GitHub` bleibt aus Kompatibilitätsgründen UNVERÄNDERT.
Sie arbeitet mit `data/bike-setup.json` im alten App-Repository und
kann ein Browser-GitHub-Token verwenden. Das neue private Huschel-Modul
arbeitet völlig getrennt über Supabase und benötigt KEIN GitHub-Token
im Browser. Alte und neue GitHub-Stände werden NICHT automatisch
zusammengeführt. Bitte erst nach ausdrücklicher Freigabe den alten
Speicherweg stilllegen/umgestalten.

Dateivergleich zur Original-ZIP:
GEÄNDERT: index.html (Button & zusätzliche Seite), app.js
  (kleine Brücke und Änderungsereignis), sw.js (PWA-Cache-Version)
NEU: huschel-amflow-speicher.js, huschel-amflow-speicher.css,
  README_HUSCHEL_SPEICHER.txt, SUPABASE_ALLOWLIST_PATCH.txt
UNCHANGED: styles.css, Daten-JSON, Icons, Manifest, README.md,
  alle bestehenden Profile und Original-Speicher-Handler.

Server-Funktionen werden vom vorhandenen Backend bereitgestellt. Diese
Testversion wurde lokal auf Syntax/Struktur geprüft; eine echte
Supabase-/GitHub-Bestätigung ist erst nach deinem Live-Test möglich.
