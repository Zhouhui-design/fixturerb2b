const CACHE_NAME = 'fixturerb2b-chat-v5';
const STATIC_CACHE = 'static-v5';
const DYNAMIC_CACHE = 'dynamic-v5';

// 需要缓存的静态资源
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/admin.html',
  '/style.css',
  '/mobile-fix.css',
  '/app.js',
  '/notification-sound.js',
  '/offline-queue.js',
  '/manifest.json',
  '/images/icon-192.png',
  '/images/icon-512.png'
];

// 安装事件 - 缓存静态资源
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker v5...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting()) // 立即跳过等待，强制激活
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker v5...');
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          // 删除所有旧版本缓存（v3, v4 等）
          if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim()) // 立即控制所有页面
  );
});

// 通知所有客户端页面刷新
function notifyClientsToReload() {
  self.clients.matchAll({ type: 'window' }).then((clients) => {
    clients.forEach((client) => {
      client.postMessage({ action: 'reload' });
    });
  });
}

//  fetch 事件 - 拦截网络请求
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // POST 请求 - 不缓存，直接通过网络
  if (request.method === 'POST') {
    event.respondWith(fetch(request));
    return;
  }

  // API 请求 - 网络优先，失败时返回缓存
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // 克隆响应以便缓存
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // 网络失败时返回缓存
          return caches.match(request);
        })
    );
    return;
  }

  // Socket.IO 请求 - 直接通过网络
  if (url.pathname.startsWith('/socket.io/')) {
    event.respondWith(fetch(request));
    return;
  }

  // 静态资源 - 缓存优先
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // 返回缓存，同时在后台更新缓存
          fetch(request)
            .then((response) => {
              if (response && response.status === 200) {
                const responseClone = response.clone();
                caches.open(STATIC_CACHE).then((cache) => {
                  cache.put(request, responseClone);
                });
              }
            })
            .catch(() => {
              // 静默失败
            });
          return cachedResponse;
        }

        // 缓存中没有，从网络获取
        return fetch(request)
          .then((response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseClone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });

            return response;
          });
      })
  );
});

// 推送通知
self.addEventListener('push', (event) => {
  console.log('[SW] Push received');
  
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: '新消息', body: event.data.text() };
  }

  const options = {
    body: data.body || '您有一条新消息',
    icon: '/images/icon-192.png',
    badge: '/images/icon-72.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/'
    },
    actions: [
      {
        action: 'open',
        title: '查看'
      },
      {
        action: 'close',
        title: '关闭'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Fixturerb2b 客服', options)
  );
});

// 通知点击事件
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked');
  
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // 检查是否已有打开的窗口
        for (let client of windowClients) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        
        // 没有则打开新窗口
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// 后台同步
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'sync-messages') {
    event.waitUntil(syncMessages());
  }
});

async function syncMessages() {
  // 离线时发送的消息同步逻辑
  console.log('[SW] Syncing offline messages...');
}

console.log('[SW] Service Worker loaded');
