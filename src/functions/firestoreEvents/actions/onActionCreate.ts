import { firestore } from 'firebase-functions';
import * as admin from 'firebase-admin';
import {
  UpdateNumberOfLikesAction,
  Action,
  propertyOf,
  mapDocument,
  Likeable,
} from '../../../types';

const updateNumberOfLikes = async (action: UpdateNumberOfLikesAction) => {
  return admin.firestore().runTransaction(async transaction => {
    console.log('updateNumberOfLikes', 'start', action);
    const actionsQuery = await transaction.get(
      admin
        .firestore()
        .collection('actions')
        .where(propertyOf<UpdateNumberOfLikesAction>('type'), '==', action.type)
        .where(propertyOf<UpdateNumberOfLikesAction>('processed'), '==', false)
        .where(
          propertyOf<UpdateNumberOfLikesAction>('likeableRef'),
          '==',
          action.likeableRef,
        )
        .limit(499),
    );
    const actions = actionsQuery.docs.map(s =>
      mapDocument<UpdateNumberOfLikesAction>(s as any),
    );
    console.log('updateNumberOfLikes', 'actions', actions);
    if (actions.length === 0) {
      console.log('updateNumberOfLikes', 'end', 'zero actions to process');
      return;
    }
    const likeableSnapshot = await transaction.get(
      admin.firestore().doc(action.likeableRef.path),
    );
    const sumOfValues = actions.reduce((acc, val) => acc + val.value, 0);
    const likeableUpdate: Likeable = {
      numberOfLikes:
        (likeableSnapshot.data() as Likeable).numberOfLikes + sumOfValues,
    };
    transaction.update(likeableSnapshot.ref, likeableUpdate);
    actions.forEach(a => {
      const actionUpdate: Partial<UpdateNumberOfLikesAction> = {
        processed: true,
      };
      transaction.update(admin.firestore().doc(a.ref.path), actionUpdate);
    });
    console.log('updateNumberOfLikes', 'end', sumOfValues);
  });
};

export const onActionCreate = firestore
  .document('actions/{actionId}')
  .onCreate(snapshot => {
    const action = snapshot.data() as Action;
    switch (action.type) {
      case 'UpdateNumberOfLikes':
        return updateNumberOfLikes(action);
      default:
        return Promise.resolve();
    }
  });
