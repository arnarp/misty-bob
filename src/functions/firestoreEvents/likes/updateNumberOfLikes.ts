import * as admin from 'firebase-admin';
import { Likeable, LikeDocument } from '../../../types';

export function updateNumberOfLikes(like: LikeDocument, value: -1 | 1) {
  return admin.firestore().runTransaction(async transaction => {
    const likeableSnapshot = await transaction.get(
      admin.firestore().doc(like.documentRef.path),
    );
    const likeableUpdate: Likeable = {
      numberOfLikes:
        (likeableSnapshot.data() as Likeable).numberOfLikes + value,
    };
    transaction.update(likeableSnapshot.ref, likeableUpdate);
  });
}
