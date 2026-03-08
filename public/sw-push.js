// Push event handler for earnings notifications
// This file is loaded by the service worker

self.addEventListener("push", (event) => {
  if (!event.data) return;

  try {
    const payload = event.data.json();
    const { title, body, icon, badge, tag, data } = payload;

    event.waitUntil(
      self.registration.showNotification(title || "StoneStocks", {
        body: body || "",
        icon: icon || "/pwa-192.png",
        badge: badge || "/pwa-192.png",
        tag: tag || "stonestocks",
        data: data || {},
        vibrate: [200, 100, 200],
        actions: [
          { action: "open", title: "Öffnen" },
          { action: "dismiss", title: "Schließen" },
        ],
      })
    );
  } catch (e) {
    console.error("Push parse error:", e);
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "dismiss") return;

  const url = event.notification.data?.url || "/watchlist";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(url) && "focus" in client) {
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});
