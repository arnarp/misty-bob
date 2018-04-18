import { firestore } from 'firebase-functions';
import { Like } from '../../../types';
import { updateNumberOfLikes } from './updateNumberOfLikes';

export const onLikeCreate = firestore
  .document('likes/{likeId}')
  .onCreate(snapshot => {
    const like = snapshot.data() as Like;
    return updateNumberOfLikes(like, 1);
  });
