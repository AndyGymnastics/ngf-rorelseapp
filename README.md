# NGF Rörelseapp

PWA för Nynäshamns GF – träningspass för rörlighet och styrka.

## Filstruktur

```
ngf-rorelseapp/
├── index.html          # App-skal
├── manifest.json       # PWA-manifest
├── sw.js               # Service Worker (offline-stöd)
├── data/
│   └── data.json       # Allt innehåll – pass, övningar, teman
├── css/
│   └── app.css         # Stilar och temavariabler
├── js/
│   ├── app.js          # Router och init
│   ├── i18n.js         # Översättningar (sv, en)
│   ├── store.js        # localStorage-hantering
│   └── views/
│       ├── home.js
│       ├── workout.js
│       ├── exercise.js
│       ├── player.js
│       ├── myworkouts.js
│       ├── settings.js
│       └── complete.js
└── admin/
    └── index.html      # Adminverktyg (separat, kräver GitHub-token)
```

## Kom igång

### 1. Skapa repository

```bash
git clone https://github.com/AndyGymnastics/ngf-rorelseapp.git
cd ngf-rorelseapp
```

### 2. Kopiera filerna

Kopiera alla filer från detta projekt till ditt repository.

### 3. Aktivera GitHub Pages

GitHub → repository → Settings → Pages → Branch: main → / (root) → Save.

Din app är nu live på:
`https://andygymnastics.github.io/ngf-rorelseapp/`

Admin: `https://andygymnastics.github.io/ngf-rorelseapp/admin/`

### 4. Lägg till videor

1. Ladda upp videofiler till Google Drive (delad mapp)
2. Högerklicka → Hämta länk → Alla med länken kan se
3. Kopiera länken
4. Klistra in i admin → Övningsbibliotek → redigera övning → Video-URL

### 5. Installera som PWA (iOS)

1. Öppna appen i Safari
2. Dela-knappen → Lägg till på hemskärmen
3. Klart

## Uppdatera innehåll

Logga in på admin med ditt GitHub-token (repo-behörighet).
Ändringar sparas direkt till data.json via GitHub API och
är live inom ~1 minut.

## Lägga till ett nytt tema

Admin → Teman → + Nytt tema → välj färger → Skapa.
Temat är omedelbart tillgängligt i appen för alla användare.

## Teknisk stack

- Vanilla JS (ES modules), inga byggverktyg
- CSS custom properties för teman
- Service Worker för offline
- localStorage för användardata
- GitHub API för admin-sparning
- Google Drive iframe för video
