import { Collection, DocumentId, UID } from './FirestoreSchema';
import { firestore } from 'firebase';
import { RawDraftContentState } from 'draft-js';
import { Overwrite, Omit } from './Utils';

/**
 * Base for user authored content.
 * Extended by Post, Comment.
 * Remember to edit firestore.rules for all who extend this
 * when changing this interface.
 */
export type Authorable = Readonly<{
  id: DocumentId;
  authorUid: UID;
  authorName: string;
  authorPhotoURL: string;
  dateOfCreation: Date;
}>;

export type Editable = Readonly<{
  dateOfLastEdit?: Date;
}>;

export type Likeable = Readonly<{
  numberOfLikes: number;
}>;

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

export type PostDocument = Omit<Post, 'id'> &
  Readonly<{
    comments?: Collection<DocumentId, Comment>;
    subscribers?: Collection<UID, Subscriber>;
  }>;

export type Subscriber = {};

export type NewPostDocument = Overwrite<
  Omit<Post, 'id' | 'dateOfLastEdit'>,
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
  }>;

export type CommentDocument = Omit<Comment, 'id'>;

export type NewCommentDocument = Overwrite<
  Omit<Comment, 'id' | 'dateOfLastEdit'>,
  {
    dateOfCreation: firestore.FieldValue;
  }
>;
