// Höj VERSION vid varje ny version av appen så hämtas den nya.
const VERSION = 'v3';
const SHELL = 'hummer-shell-' + VERSION;
const TILES = 'hummer-tiles';
const MAX_TILES = 800;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(SHELL).then(c => c.addAll(['./', 'manifest.json', 'icon-192.png',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'])).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('hummer-shell-') && k !== SHELL).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET') return;
  if (url.hostname.endsWith('firebaseio.com') || url.hostname.endsWith('firebasedatabase.app')) return; // alltid nät

  // Kartbitar: visa sparad bit direkt, annars hämta och spara (så fungerar kartan utan täckning där man varit)
  if (url.hostname === 'tile.openstreetmap.org') {
    e.respondWith(caches.open(TILES).then(async c => {
      const hit = await c.match(req); if (hit) return hit;
      const res = await fetch(req);
      if (res.ok) { c.put(req, res.clone()); trim(c); }
      return res;
    }));
    return;
  }
  // Själva appen: nät först, sparad kopia om nätet saknas
  if (url.origin === location.origin || url.hostname === 'unpkg.com') {
    e.respondWith(fetch(req).then(res => {
      if (res.ok) caches.open(SHELL).then(c => c.put(req, res.clone()));
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('./'))));
  }
});

async function trim(c) {
  const keys = await c.keys();
  for (let i = 0; i < keys.length - MAX_TILES; i++) c.delete(keys[i]);
}
