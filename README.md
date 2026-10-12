# Amflow PX Setup Cockpit – V1.0.0

Eigenständige GitHub-Pages-Web-App für das **Amflow PX Carbon Pro 2026 / Avinox M2S**. Enthält drei nebeneinander dargestellte, editierbare Profile: **Mein Bike (tatsächlich gemessene Ist-Einstellungen, initial leer)**, **Waldtrail** und **Allgäu Berge**.

## Funktionen

- Direkter Vergleich aller Motorparameter (ECO, AUTO, TRAIL, TURBO, BOOST), FOX 36 Factory / FOX Float X Factory, Tubeless-Reifendrücke, Akku und Systemoptionen.
- Beide Empfehlungen sind editierbar; Reset stellt **nur** die Empfehlungen wieder her.
- Ist-Werte bleiben absichtlich leer. Kein Zugriff auf Fahrrad oder Avinox Ride App.
- Testfahrten erfassen, ändern und löschen (Datum, Tour, km, Höhenmeter, Akku-Start/Ende, Untergrund, Grip, Motor-Dosierung, Fahrwerk, Notizen). Jede neue Testfahrt erhält außerdem einen unveränderlichen **Einstellungs-Schnappschuss** des ausgewählten Profils und der damaligen Ist-Werte.
- Grobe Verbrauchsabschätzung in Wh/km aus Akku-Prozentpunkten × 700 Wh. **Keine Energiemessung**; abhängig von nutzbarer Batteriekapazität und Ladestandsanzeige.
- Automatische **lokale** Speicherung (localStorage), JSON-Export/Import und CSV-Vergleichsexport.
- Optionale manuelle GitHub-Synchronisierung über GitHub Contents API: `data/bike-setup.json`.
- PWA/Startbildschirm-App mit Offline-Fallback nach erstem Onlinebesuch (Mac, iPad, iPhone).
- Kein Tracking, keine externen Javascript-Bibliotheken.

## Installation auf GitHub Pages

1. Ein neues Repository bei GitHub erstellen, beispielsweise `amflow-px-setup`.
2. **Den Inhalt dieses Hauptordners** (nicht noch einen Unterordner) in die Wurzel des GitHub-Repositories hochladen: `index.html`, `app.js`, `styles.css`, `manifest.webmanifest`, `sw.js`, `assets/`, `README.md`.
3. In GitHub: **Settings → Pages → Build and deployment → Deploy from a branch → main / (root) → Save**.
4. Nach der Veröffentlichung die GitHub-Pages-Adresse auf Mac, iPad oder iPhone öffnen.
5. Reiter **Speichern & GitHub**: Nutzername, Repository und Branch eintragen.
6. Zum erstmaligen Schreiben: einen **Fine-grained Personal Access Token** mit **Repository access: Only select repositories (dieses Repository)** und **Repository permissions → Contents: Read and write** erstellen: https://github.com/settings/personal-access-tokens/new . In die App eingeben und **Auf GitHub speichern**.
7. Auf einem anderen Gerät dieselbe Website öffnen, Nutzernamen und Repository eintragen und **Von GitHub laden** wählen. Bei einem öffentlichen Repository kann Lesen ohne Token funktionieren. Zum Schreiben ist auch dort ein Token erforderlich. Nach erfolgreicher Erstsynchronisierung kann die App neue GitHub-Stände beim Start automatisch laden, **solange keine ungesicherten lokalen Änderungen vorliegen**.

## Wichtige Einschränkungen

- **GitHub Pages allein synchronisiert keine lokalen Daten.** Es braucht das explizite Laden/Speichern über die GitHub API. Das Laden ersetzt nach Bestätigung die lokalen Werte. Erst JSON-Backup erstellen, wenn lokale Daten wichtig sind.
- Das Token ist **nicht** Bestandteil der Backups oder des Repositorys. Es wird standardmäßig nur während der aktuell geöffneten Seite im Arbeitsspeicher gehalten. Optional kann es für diese Browser-Sitzung im `sessionStorage` gesichert werden, niemals in localStorage, GitHub oder JSON. Auf einem fremden Gerät Token nicht speichern.
- Die Synchronisierung nutzt den SHA des letzten Downloads/Uploads. Hat ein anderes Gerät seitdem gespeichert, wird der Upload blockiert und ein manuelles Auflösen verlangt. Es gibt **keinen automatischen Merge**. Bei einer noch nicht verbundenen App wird das Überschreiben einer bereits bestehenden GitHub-Datei verhindert.
- In einem **öffentlichen** GitHub-Repository sind auch deine JSON-Testfahrten öffentlich und möglicherweise in der Commit-Historie einsehbar. Keine privaten Inhalte speichern.
- Das Tool liest **keine** realen Bike-Werte aus und überträgt keine Einstellungen an den Motor. Alle Einstellwerte sind Ausgangsempfehlungen zum Testen, keine Werksdaten und nicht alle Firmware-Versionen bieten alle Felder.
- Reifendruck / Luftdruck / Dämpfung immer gemäß gültiger Herstellergrenzen, tatsächlichem SAG und Praxistest abstimmen.
- Zur Sicherheit ist der gesetzliche Geschwindigkeitsgrenzwert nicht veränderbar durch diese App.

## Datenstruktur

JSON `schemaVersion: 1`, `profiles.current`, `profiles.forest`, `profiles.alpine`, `rides[]` und `meta`. Daten werden unter dem Browser-Schlüssel `amflow-px-setup-data-v1` gespeichert. GitHub-Repository-Konfiguration separat unter `amflow-px-setup-github-v1`, Token nur flüchtig beziehungsweise optional im Sitzungsspeicher.

## Technik / Weiterentwicklung

Reines HTML/CSS/JavaScript ohne Build-Werkzeuge oder Backend. Die ursprünglichen Empfehlungen stehen lesbar in der Konstante `GROUPS` in `app.js`. Keine externe Pakete erforderlich.

Referenzen: [Avinox Drive System User Manual 2026](https://dl.avinox-ebike.com/downloads/Avinox/20260409/Avinox_Drive_System_User_Manual_EN.pdf) und [GitHub REST Contents API](https://docs.github.com/en/rest/repos/contents).
