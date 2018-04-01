import { Collection, DocumentId } from './FirestoreSchema';
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
  id: string;
  authorUid: string;
  authorName: string;
  authorPhotoURL: string;
  dateOfCreation: Date;
  dateOfLastEdit?: Date;
}>;

export type Post = Authorable &
  Readonly<{
    /** Starts as same as dateOfCreation and then will be the date of last comment */
    dateOfLastActivity: Date;
    title: string;
    content: RawDraftContentState;
    // comments?: Collection<DocumentId, Comment>;
  }>;

export type PostDocument = Post &
  Readonly<{
    comments?: Collection<DocumentId, Comment>;
  }>;

export type NewPostDocument = Overwrite<
  Omit<Post, 'id' | 'dateOfLastEdit'>,
  {
    dateOfCreation: firestore.FieldValue;
    dateOfLastActivity: firestore.FieldValue;
  }
>;

export type Comment = Authorable &
  Readonly<{
    content: RawDraftContentState;
  }>;

export type NewCommentDocument = Overwrite<
  Omit<Comment, 'id' | 'dateOfLastEdit'>,
  {
    dateOfCreation: firestore.FieldValue;
  }
>;
