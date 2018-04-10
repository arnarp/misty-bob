import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);

export { onCommentCreate } from './onCommentCreate';
export { refreshFCMToken } from './httpsCallable';

export const helloWorld = functions.https.onRequest(
  async (request, response) => {
    // This registration token comes from the client FCM SDKs.
    var registrationToken =
      'dF6XbwAkVW4:APA91bH9yKCbL4YcIqe8jEz8KljK5OMYOm-3fakPwJ5gQHKU9EFGp8x9SgspVsQMVpIxy1dnvroiupK1mW9ySmdjobVMOCGG0sHVfH32skwoevUQB8UMBu3DPKJaUDsW-e8sPn2YIvou';

    // See documentation on defining a message payload.
    var message: admin.messaging.MessagingPayload = {
      data: {
        score: '850',
        time: '2:45',
      },
      notification: {
        title: 'Misty Bob',
        body: 'Hello from Bob',
        clickAction: 'https://misty-bob.firebaseapp.com/d/wvHNPZJxV5i1wZWKuC07',
      },
    };

    // Send a message to the device corresponding to the provided
    // registration token.
    await admin
      .messaging()
      .sendToDevice(registrationToken, message)
      .then(r => {
        // Response is a message ID string.
        console.log('Successfully sent message:', r);
      })
      .catch(error => {
        console.log('Error sending message:', error);
      });
    return response.json({ message: 'Hello from Firebase! build-functions' });
  },
);
