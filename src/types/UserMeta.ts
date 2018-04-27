import { firestore } from 'firebase/app';
import { Overwrite, Omit, BaseDocument, UserClaims } from '.';

export type UserMeta = BaseDocument &
  Readonly<{
    messagingTokens: Array<MessagingToken>;
    pushNotifications: {
      enabled: boolean;
      comments: 'all' | 'off';
      likes: 'all' | 'off';
    };
    claimsRefreshTime?: Date;
    claims: UserClaims;
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
