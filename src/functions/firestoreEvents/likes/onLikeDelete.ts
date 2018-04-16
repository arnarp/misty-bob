import { firestore } from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Like, NewUpdateNumberOfLikesActionDocument } from '../../../types';

export const onLikeDelete = firestore
  .document('likes/{likeId}')
  .onDelete(snapshot => {
    const like = snapshot.data() as Like;
    const action: NewUpdateNumberOfLikesActionDocument = {
      type: 'UpdateNumberOfLikes',
      processed: false,
      value: -1,
      likeableRef: like.documentRef,
    };
    return admin
      .firestore()
      .collection('actions')
      .add(action);
  });
