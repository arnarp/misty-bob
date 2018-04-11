import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/messaging';
import 'firebase/functions';

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
};

firebase.initializeApp(config);

export const firestore = firebase.firestore();
export const auth = firebase.auth;
export const functions: {
  httpsCallable: <R>(func: string) => (data: any) => Promise<R>;
} = (firebase as any).functions();
export const messaging = firebase.messaging();
(messaging as any).usePublicVapidKey(
  'BIjDev_YYT1Txrc4KUtAZKdckT4jwuc__cApIXjktyex-0LA8Q-xUYrivAGoqj7iVq_2SK1b7LyNgzbe8MdRQhA',
);
// const request = messaging.requestPermission();

// if (request !== null) {
//   request
//     .then(function() {
//       console.log('Notification permission granted.');
//       // TODO(developer): Retrieve an Instance ID token for use with FCM.
//       // ...
//       const getTokenPromise = messaging.getToken();
//       if (getTokenPromise === null) {
//         return;
//       }
//       getTokenPromise
//         .then(function(refreshedToken: any) {
//           console.log('Token refreshed.', refreshedToken);
//           // Indicate that the new Instance ID token has not yet been sent to the
//           // app server.
//           // setTokenSentToServer(false);
//           // Send Instance ID token to app server.
//           // sendTokenToServer(refreshedToken);
//           // ...
//         })
//         .catch(function(err: any) {
//           console.log('Unable to retrieve refreshed token ', err);
//           // showToken('Unable to retrieve refreshed token ', err);
//         });
//     })
//     .catch(function(err: any) {
//       console.log('Unable to get permission to notify.', err);
//     });
// }

// Callback fired if Instance ID token is updated.
messaging.onTokenRefresh(function() {
  const getTokenPromise = messaging.getToken();
  if (getTokenPromise === null) {
    return;
  }
  getTokenPromise
    .then(function(refreshedToken: string) {
      console.log('Token refreshed.', refreshedToken);
      // Indicate that the new Instance ID token has not yet been sent to the
      // app server.
      // setTokenSentToServer(false);
      // Send Instance ID token to app server.
      // sendTokenToServer(refreshedToken);
      // ...
    })
    .catch(function(err: any) {
      console.log('Unable to retrieve refreshed token ', err);
      // showToken('Unable to retrieve refreshed token ', err);
    });
});

// Handle incoming messages. Called when:
// - a message is received while the app has focus
// - the user clicks on an app notification created by a service worker
//   `messaging.setBackgroundMessageHandler` handler.
messaging.onMessage(function(payload: any) {
  console.log('Message received. ', payload);
});

export const refreshFCMToken = () =>
  functions.httpsCallable('refreshFCMToken')({});
