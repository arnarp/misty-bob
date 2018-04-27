import { auth } from 'firebase-functions';
import * as admin from 'firebase-admin';
import { UserMetaDocument } from '../../types';

export const onUserCreate = auth.user().onCreate((user, context) => {
  const newUserMetaDocument: UserMetaDocument = {
    messagingTokens: [],
    claims: {},
    claimsRefreshTime: undefined,
    pushNotifications: {
      enabled: false,
      comments: 'all',
      likes: 'all',
    },
  };
  return admin
    .firestore()
    .collection('userMetas')
    .doc(user.uid)
    .set(newUserMetaDocument)
    .then(result => console.log({ result }))
    .catch(reason => console.log({ reason }));
});
