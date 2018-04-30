import { firestore } from 'firebase-functions';
import * as admin from 'firebase-admin';
import { PublicUserInfo, UserMetaDocument } from '../../../types';

export const onPublicUserInfoCreate = firestore
  .document('/publicUserInfo/{username}')
  .onCreate((snapshot, context) => {
    const newPublicUserInfo = snapshot.data() as PublicUserInfo;
    const userMetaDocumentUpdate: Partial<UserMetaDocument> = {
      claims: {
        username: newPublicUserInfo.username,
      },
    };
    return admin
      .firestore()
      .collection('userMetas')
      .doc(newPublicUserInfo.uid)
      .update(userMetaDocumentUpdate);
  });
