import { firestore } from 'firebase/app';
import { Overwrite, Omit, BaseDocument } from '.';

export type UserMeta = BaseDocument &
  Readonly<{
    messagingTokens: Array<MessagingToken>;
    notificationsEnabled: boolean;
  }>;

export type MessagingToken = Readonly<{
  token: string;
  refreshed: Date;
  /**
   * navigator.userAgent
   */
  userAgent: string;
  /**
   * navigator.language
   */
  language: string;
}>;

export type NewMessagingToken = Overwrite<
  MessagingToken,
  {
    refreshed: firestore.FieldValue;
  }
>;

export type UserMetaDocument = Omit<UserMeta, 'id' | 'ref'>;
export type NewUserMetaDocument = Overwrite<
  UserMetaDocument,
  {
    messagingTokens: Array<MessagingToken | NewMessagingToken>;
  }
>;
