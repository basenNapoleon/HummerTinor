# Hummertinor

Enkel app för att logga var hummertinorna ligger. En HTML-fil + service worker, ingen byggprocess.

## Filer
- `index.html` – hela appen
- `sw.js` – offline-stöd (höj `VERSION` vid varje ny version)
- `manifest.json`, `icon-*.png`, `apple-touch-icon.png` – så den kan läggas på hemskärmen

## Slå på delning mellan telefoner (Firebase, gratis)
Utan detta sparas tinorna bara på den egna telefonen.

1. Gå till https://console.firebase.google.com och skapa ett projekt (Analytics behövs inte).
2. Bygg → **Realtime Database** → Skapa databas → välj plats **europe-west1** → starta i låst läge.
3. Fliken **Regler**, klistra in och publicera:
   ```json
   {
     "rules": {
       "grupper": {
         "$kod": { ".read": true, ".write": true }
       }
     }
   }
   ```
   Det går inte att lista grupper, så gruppkoden fungerar som lösenord. Den som kan koden kan läsa och ändra.
4. Kopiera databasens adress (t.ex. `https://hummertinor-xxxx-default-rtdb.europe-west1.firebasedatabase.app`).
5. Överst i skriptet i `index.html`, fyll i:
   ```js
   FIREBASE_URL: 'https://…firebasedatabase.app',
   GROUP: 'en-egen-hemlig-kod-123',
   ```
6. Pusha. Alla som öppnar sidan ser nu samma tinor. Utan täckning sparas ändringar i telefonen och skickas när nätet är tillbaka.

## Kartan
OpenStreetMap + sjömärken från OpenSeaMap. Inga djupsiffror: Sjöfartsverkets sjökort kräver tillstånd/avgift.
Kartlagren ställs in i `CFG.BASE` och `CFG.SEAMARKS` i `index.html`.

## Testat / inte testat
Testat i simulerad iPhone med låtsasdatabas: skapa person, rita flöte, lägga/flytta/ta upp tina, 6-gränsen, delning mellan två telefoner.
Inte testat här (gick inte att nå utifrån byggmiljön): riktiga kartbitar, riktig Firebase, GPS på riktig telefon.
