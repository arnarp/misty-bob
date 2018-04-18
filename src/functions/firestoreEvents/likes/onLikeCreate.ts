import { firestore } from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Like, NewUpdateNumberOfLikesActionDocument } from '../../../types';
import { updateNumberOfLikes } from './updateNumberOfLikes';

export const onLikeCreate = firestore
  .document('likes/{likeId}')
  .onCreate(snapshot => {
    const like = snapshot.data() as Like;
    return updateNumberOfLikes(like, 1);
  });
