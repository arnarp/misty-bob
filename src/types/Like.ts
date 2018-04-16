import { Authorable, NewAuthorableDocument } from '.';
import { Omit, Overwrite } from './Utils';
import { firestore } from 'firebase';

export type Like = Authorable &
  Readonly<{
    documentType: 'Post' | 'Comment';
    documentRef: firestore.DocumentReference;
    pageIds: { [key: string]: boolean };
  }>;

export type LikeDocument = Omit<Like, 'id' | 'ref'>;

export type NewLikeDocument = Overwrite<LikeDocument, NewAuthorableDocument>;
