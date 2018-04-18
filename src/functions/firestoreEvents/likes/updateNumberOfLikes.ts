import { firestore } from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Like, Likeable } from '../../../types';

export function updateNumberOfLikes(like: Like, value: -1 | 1) {
  return admin.firestore().runTransaction(async transaction => {
    const likeableSnapshot = await transaction.get(
      admin.firestore().doc(like.ref.path),
    );
    const likeableUpdate: Likeable = {
      numberOfLikes:
        (likeableSnapshot.data() as Likeable).numberOfLikes + value,
    };
    transaction.update(likeableSnapshot.ref, likeableUpdate);
  });
}
