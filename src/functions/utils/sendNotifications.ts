import * as admin from 'firebase-admin';
import { mapDocument, UserMeta, AuthorableDocument } from '../../types';

export async function sendNotifications(
  subscribers: string[],
  notification: admin.messaging.MessagingPayload,
  sendToUser: (meta: UserMeta) => boolean,
  activityDocument: AuthorableDocument,
) {
  const userMetaDocuments = await Promise.all(
    subscribers.map(s =>
      admin
        .firestore()
        .collection('userMetas')
        .doc(s)
        .get()
        .then(val => {
          if (!val.exists) {
            return undefined;
          }
          const userMeta = mapDocument<UserMeta>(val as any);
          if (
            userMeta.pushNotifications.enabled === false ||
            !sendToUser(userMeta)
          ) {
            return undefined;
          }
          return userMeta;
        }),
    ),
  );
  const messagingTokens = userMetaDocuments.reduce((acc, val) => {
    if (val === undefined || val.id === activityDocument.authorUid) {
      return acc;
    }
    val.messagingTokens.map(t => t.token).forEach(i => acc.add(i));
    return acc;
  }, new Set<string>());
  if (messagingTokens.size === 0) {
    return;
  }
  return admin
    .messaging()
    .sendToDevice(Array.from(messagingTokens.values()), notification)
    .then(r => {
      // Response is a message ID string.
      console.log('Successfully sent message:', r);
    })
    .catch(error => {
      console.log('Error sending message:', error);
    });
}
