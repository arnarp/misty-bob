import { firestore } from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Like, NewUpdateNumberOfLikesActionDocument } from '../../../types';

export function addUpdateNumberOfLikesAction(like: Like, value: -1 | 1) {
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
}
