import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { NewPublicUserInfoDocument } from '../../types';
import { firestore } from 'firebase';

export const registerUsername = functions.https.onCall(
  (username: string, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated');
    }
    const newPublicUserInfo: NewPublicUserInfoDocument = {
      username,
      displayName: context.auth.token.name,
      photoURL: context.auth.token.picture,
      uid: context.auth.uid,
      registrationDate: firestore.FieldValue.serverTimestamp(),
    };
    admin
      .firestore()
      .collection('publicUserInfo')
      .doc(username)
      .create(newPublicUserInfo)
      .then(value => {
        return { message: 'ok' };
      })
      .catch(reason => {
        console.log(reason);
        throw new functions.https.HttpsError('already-exists');
      });
  },
);
