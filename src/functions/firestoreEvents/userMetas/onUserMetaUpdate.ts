import { firestore } from 'firebase-functions';
import * as admin from 'firebase-admin';
import { UserMetaDocument, NewUserMetaDocument } from '../../../types';

export const onUserMetaUpdate = firestore
  .document('/userMetas/{uid}')
  .onUpdate(async (change, context) => {
    if (!context) {
      return;
    }
    const before = change.before.data() as UserMetaDocument;
    const after = change.after.data() as UserMetaDocument;
    if (JSON.stringify(before.claims) === JSON.stringify(after.claims)) {
      return;
    }
    await admin.auth().setCustomUserClaims(context.params.uid, after.claims);
    const userMetaUpdate: Partial<NewUserMetaDocument> = {
      claimsRefreshTime: admin.firestore.FieldValue.serverTimestamp(),
    };
    return admin
      .firestore()
      .collection('/userMetas')
      .doc(context.params.uid)
      .update(userMetaUpdate);
  });
