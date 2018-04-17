import { Collection } from './FirestoreSchema';
import { firestore } from 'firebase';
import { RawDraftContentState } from 'draft-js';
import {
  Authorable,
  Likeable,
  Editable,
  Omit,
  DocumentId,
  UID,
  Overwrite,
} from '.';

export type Post = Authorable &
  Likeable &
  Editable &
  Readonly<{
    /** Starts as same as dateOfCreation and then will be the date of last comment */
    dateOfLastActivity: Date;
    title: string;
    content: RawDraftContentState;
    numberOfComments: number;
  }>;

export type PostDocument = Omit<Post, 'id' | 'ref'> &
  Readonly<{
    comments?: Collection<DocumentId, Comment>;
    subscribers?: Collection<UID, Subscriber>;
  }>;

export type Subscriber = {};

export type NewPostDocument = Overwrite<
  Omit<Post, 'id' | 'ref' | 'dateOfLastEdit'>,
  {
    dateOfCreation: firestore.FieldValue;
    dateOfLastActivity: firestore.FieldValue;
  }
>;

export type Comment = Authorable &
  Likeable &
  Editable &
  Readonly<{
    content: RawDraftContentState;
    postId: string;
  }>;

export type CommentDocument = Omit<Comment, 'id' | 'ref'>;

export type NewCommentDocument = Overwrite<
  Omit<Comment, 'id' | 'ref' | 'dateOfLastEdit'>,
  {
    dateOfCreation: firestore.FieldValue;
  }
>;
