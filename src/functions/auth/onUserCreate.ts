import { auth } from 'firebase-functions';
import * as admin from 'firebase-admin';
import { DefaultUserMetaDocument } from '../../types';

export const onUserCreate = auth.user().onCreate((user, context) => {
  const newUserMetaDocument = {
    ...DefaultUserMetaDocument,
  };
  return admin
    .firestore()
    .collection('userMetas')
    .doc(user.uid)
    .create(newUserMetaDocument);
});
