// Lagrer spillet på telefonen første gang det åpnes, så det virker uten nett etterpå.
// Bytt versjonsnavnet når spillet oppdateres, så telefonen henter den nye utgaven.
const LAGER = "tarzan-hermine-v33";
const FILER = ["./", "./index.html", "./manifest.webmanifest", "./ikon-180.png", "./ikon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(LAGER).then(c => c.addAll(FILER))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(n => Promise.all(n.filter(k => k !== LAGER).map(k => caches.delete(k)))));
  self.clients.claim();
});
// Prøver nettet først, og bruker den lagrede utgaven når du er offline
self.addEventListener("fetch", e => {
  e.respondWith(fetch(e.request).then(svar => {
    const kopi = svar.clone(); caches.open(LAGER).then(c => c.put(e.request, kopi)); return svar;
  }).catch(() => caches.match(e.request, { ignoreSearch: true })));
});
