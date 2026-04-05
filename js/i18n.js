const TRANSLATIONS = {
  sv: {
    appName: 'NGF Rörelseapp',
    orgName: 'Nynäshamns GF',
    nav: { hem: 'Hem', minaPass: 'Mina pass', installningar: 'Inställn.' },
    greeting: {
      morning: 'God morgon',
      day: 'God dag',
      evening: 'God kväll',
      generic: 'Välkommen till NGF Rörelseapp 💚'
    },
    pass: {
      ovningar: 'övningar',
      start: 'Starta pass',
      autoPlay: 'Auto-play',
      autoPlayDesc: 'Gå vidare automatiskt när tiden är ute',
      back: '←',
      close: '✕'
    },
    exercise: {
      repeats: 'repeteras',
      videoTitle: 'Videodemonstration',
      videoSource: 'Google Drive',
      videoOffline: 'Video kräver internetanslutning.',
      instruction: 'Håll positionen och andas djupt. Fokusera på mjuk, kontrollerad rörelse. Stanna om du känner smärta.'
    },
    player: {
      skip: 'Hoppa →',
      pause: '⏸ Paus',
      play: '▶ Kör',
      next: 'Nästa →',
      auto: 'Auto',
      manual: 'Manuell',
      sek: 'SEK'
    },
    complete: {
      icon: '🎉',
      title: 'Bra jobbat',
      titleWith: (name) => `Bra jobbat, ${name}!`,
      sub: (name) => `Du har slutfört ${name}.`,
      home: 'Tillbaka till start'
    },
    myWorkouts: {
      title: 'Mina pass',
      favorites: 'Favoriter',
      history: 'Träningshistorik',
      noFavorites: 'Inga favoriter ännu. Tryck på ☆ på ett pass för att spara det här.',
      done: '✓ Klar',
      kl: 'kl.',
      min: 'min'
    },
    settings: {
      title: 'Inställningar',
      profile: 'Profil',
      name: 'Namn',
      namePlaceholder: 'Ditt namn',
      email: 'E-post',
      emailPlaceholder: 'din@epost.se',
      appearance: 'Utseende',
      theme: 'Tema',
      language: 'Språk',
      selectLanguage: 'Välj språk',
      data: 'Data',
      clearHistory: 'Rensa träningshistorik',
      support: 'Support',
      contact: 'Kontakta oss',
      version: 'NGF Rörelseapp v1.0 · Nynäshamns GF'
    },
    themes: { light: 'Ljust', dark: 'Mörkt', auto: 'Auto', pink: 'Rosa' },
    languages: { sv: 'Svenska', en: 'English' },
    modal: {
      clearTitle: 'Rensa historik?',
      clearBody: 'All träningshistorik tas bort permanent. Det går inte att ångra.',
      cancel: 'Avbryt',
      confirm: 'Rensa'
    },
    offline: 'Du är offline – sparad data visas'
  },
  en: {
    appName: 'NGF Move App',
    orgName: 'Nynäshamns GF',
    nav: { hem: 'Home', minaPass: 'My Workouts', installningar: 'Settings' },
    greeting: {
      morning: 'Good morning',
      day: 'Good day',
      evening: 'Good evening',
      generic: 'Welcome to NGF Move App 💚'
    },
    pass: {
      ovningar: 'exercises',
      start: 'Start workout',
      autoPlay: 'Auto-play',
      autoPlayDesc: 'Advance automatically when time is up',
      back: '←',
      close: '✕'
    },
    exercise: {
      repeats: 'repeat',
      videoTitle: 'Video demonstration',
      videoSource: 'Google Drive',
      videoOffline: 'Video requires an internet connection.',
      instruction: 'Hold the position and breathe deeply. Focus on smooth, controlled movement. Stop if you feel pain.'
    },
    player: {
      skip: 'Skip →',
      pause: '⏸ Pause',
      play: '▶ Go',
      next: 'Next →',
      auto: 'Auto',
      manual: 'Manual',
      sek: 'SEC'
    },
    complete: {
      icon: '🎉',
      title: 'Well done',
      titleWith: (name) => `Well done, ${name}!`,
      sub: (name) => `You completed ${name}.`,
      home: 'Back to start'
    },
    myWorkouts: {
      title: 'My Workouts',
      favorites: 'Favourites',
      history: 'Training history',
      noFavorites: 'No favourites yet. Tap ☆ on a workout to save it here.',
      done: '✓ Done',
      kl: 'at',
      min: 'min'
    },
    settings: {
      title: 'Settings',
      profile: 'Profile',
      name: 'Name',
      namePlaceholder: 'Your name',
      email: 'Email',
      emailPlaceholder: 'your@email.com',
      appearance: 'Appearance',
      theme: 'Theme',
      language: 'Language',
      selectLanguage: 'Select language',
      data: 'Data',
      clearHistory: 'Clear training history',
      support: 'Support',
      contact: 'Contact us',
      version: 'NGF Move App v1.0 · Nynäshamns GF'
    },
    themes: { light: 'Light', dark: 'Dark', auto: 'Auto', pink: 'Pink' },
    languages: { sv: 'Svenska', en: 'English' },
    modal: {
      clearTitle: 'Clear history?',
      clearBody: 'All training history will be permanently deleted. This cannot be undone.',
      cancel: 'Cancel',
      confirm: 'Clear'
    },
    offline: 'You are offline – showing cached data'
  }
};

export function t(lang, path) {
  const keys = path.split('.');
  let val = TRANSLATIONS[lang] || TRANSLATIONS.sv;
  for (const k of keys) {
    if (val == null) return path;
    val = val[k];
  }
  return val ?? path;
}

export function getGreeting(lang, name) {
  const h = new Date().getHours();
  const key = h < 10 ? 'morning' : h < 18 ? 'day' : 'evening';
  if (!name) return t(lang, 'greeting.generic');
  return `${t(lang, `greeting.${key}`)}, ${name} 👋`;
}

export const SUPPORTED_LANGS = ['sv', 'en'];
