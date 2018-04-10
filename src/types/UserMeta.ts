import { UID } from './FirestoreSchema';
import { Omit, Overwrite } from './Utils';
import { firestore } from 'firebase/app';

export type UserMeta = Readonly<{
  uid: UID;
  messagingTokens: Array<MessagingToken>;
}>;

export type MessagingToken = Readonly<{
  token: string;
  refreshed: Date;
}>;

export type NewMessagingToken = Overwrite<
  MessagingToken,
  {
    refreshed: firestore.FieldValue;
  }
>;

export type UserMetaDocument = Omit<UserMeta, 'uid'>;
export type NewUserMetaDocument = Overwrite<
  UserMetaDocument,
  {
    messagingTokens: Array<MessagingToken | NewMessagingToken>;
  }
>;
