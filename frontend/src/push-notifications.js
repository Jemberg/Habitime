import { urlBase64ToUint8Array } from "./serviceWorkerRegistration";

export function askForNotificationPermission() {
  Notification.requestPermission(function (result) {
    if (result === "granted") {
      confirmPushSub();
    }
  });
}

function displayConfirmation() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then((serviceWorkerRegister) => {
      serviceWorkerRegister.showNotification("Successfully Subscribed!");
    });
  }
}

function confirmPushSub() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  let register;

  navigator.serviceWorker.ready
    .then((serviceWorkerRegister) => {
      register = serviceWorkerRegister;
      return serviceWorkerRegister.pushManager.getSubscription();
    })
    .then((subscription) => {
      if (subscription === null) {
        const vapidPublic = `${process.env.REACT_APP_VAPID_PUBLICKEY}`;
        const convertedKey = urlBase64ToUint8Array(vapidPublic);

        const options = {
          userVisibleOnly: true,
          applicationServerKey: convertedKey,
        };

        return register.pushManager.subscribe(options);
      }
    })
    .then((newSub) => {
      return fetch(
        `${process.env.REACT_APP_FIREBASE_DB_URL}/subscription.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(newSub),
          redirect: "follow",
        }
      );
    })
    .then((res) => {
      if (res.ok) {
        displayConfirmation();
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
