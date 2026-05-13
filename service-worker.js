// service-worker.js
const CACHE_NAME = 'thai-study-v1';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './data/consonants.js',
  './data/words.js',
  './modules/tts.js',
  './modules/store.js',
  './modules/letters.js',
  './modules/words.js',
  './modules/today.js',
];

// 설치: 모든 파일 캐시
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// 활성화: 이전 캐시 삭제
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// 요청 처리: 캐시 우선, 없으면 네트워크
self.addEventListener('fetch', e => {
  // Firebase/Google Fonts 같은 외부 요청은 그냥 통과
  if (!e.request.url.startsWith(self.location.origin)) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        // 성공한 응답은 캐시에 추가
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return response;
      });
    })
  );
});

// 업데이트 감지: 새 서비스워커 대기 중이면 클라이언트에 알림
self.addEventListener('message', e => {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
});
