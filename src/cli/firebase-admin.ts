import * as admin from 'firebase-admin';

var serviceAccount = require('../../misty-bob-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const adminFirestore = admin.firestore();
