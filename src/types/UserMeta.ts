import { firestore } from 'firebase/app';
import { UID, Overwrite, Omit } from '.';

export type UserMeta = Readonly<{
  uid: UID;
  messagingTokens: Array<MessagingToken>;
}>;

export type MessagingToken = Readonly<{
  token: string;
  refreshed: Date;
  userAgent: string;
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
