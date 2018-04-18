import { firestore } from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Like, NewUpdateNumberOfLikesActionDocument } from '../../../types';
import { updateNumberOfLikes } from './updateNumberOfLikes';
// import { addUpdateNumberOfLikesAction } from './addUpdateNumberOfLikesAction';

export const onLikeDelete = firestore
  .document('likes/{likeId}')
  .onDelete(snapshot => {
    // Later if number of likes load get's high
    // return addUpdateNumberOfLikesAction(snapshot.data() as Like, -1);
    return updateNumberOfLikes(snapshot.data() as Like, -1);
  });
