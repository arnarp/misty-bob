import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { UserMetaDocument, NewUserMetaDocument } from '../../types/UserMeta';

export const refreshFCMToken = functions.https.onCall((data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated');
  }
  if (context.instanceIdToken === undefined || data.userAgent === undefined) {
    throw new functions.https.HttpsError('failed-precondition');
  }
  const fcmToken = context.instanceIdToken as string;
  const newToken = {
    token: fcmToken,
    refreshed: new Date(),
    userAgent: data.userAgent,
    language: data.language,
  };
  const userMetaDocRef = admin
    .firestore()
    .collection('userMetas')
    .doc(context.auth.uid);
  return admin.firestore().runTransaction(async transaction => {
    const userMetaSnapshot = await transaction.get(userMetaDocRef);
    if (!userMetaSnapshot.exists) {
      const newUserMetaDocument: NewUserMetaDocument = {
        messagingTokens: [newToken],
      };
      return transaction.create(userMetaDocRef, newUserMetaDocument);
    }
    const currentMessagingTokens = (userMetaSnapshot.data() as UserMetaDocument)
      .messagingTokens;
    const userMetaDocumentUpdate: Partial<NewUserMetaDocument> = {
      messagingTokens:
        currentMessagingTokens.find(mt => mt.token === fcmToken) === undefined
          ? [...currentMessagingTokens, newToken]
          : currentMessagingTokens.map(
              i => (i.token === fcmToken ? newToken : i),
            ),
    };
    await transaction.update(userMetaDocRef, userMetaDocumentUpdate);
    return { message: 'ok' };
  });
});
