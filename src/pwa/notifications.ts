export function requestPermission() {
  Notification.requestPermission((status) => {
    console.log('Notification permission status:', status);
  })
}

export function displayNotification(title: string, body: string, actions: NotificationAction[]) {
  if (Notification.permission == 'granted') {
    navigator.serviceWorker.getRegistration().then((reg) => {
      const options = {
        actions,
        icon: require("@/assets/logo.png"),
        data: {
          dateOfArrival: Date.now(),
          primaryKey: 1
        }
      };
      reg?.showNotification(title, options);
    });
  }
}