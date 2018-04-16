import { firestore } from 'firebase';
import { BaseDocument, Omit } from '.';

export type ActionType = 'UpdateNumberOfLikes' | 'Dummy';

export type BaseAction = BaseDocument &
  Readonly<{
    type: ActionType;
    processed: boolean;
  }>;

export type UpdateNumberOfLikesAction = BaseAction &
  Readonly<{
    type: 'UpdateNumberOfLikes';
    likeableRef: firestore.DocumentReference;
    value: -1 | 1;
  }>;

export type NewUpdateNumberOfLikesActionDocument = Omit<
  UpdateNumberOfLikesAction,
  'id' | 'ref'
>;

export type DummyAction = BaseAction & Readonly<{ type: 'Dummy' }>;

export type Action = UpdateNumberOfLikesAction | DummyAction;
