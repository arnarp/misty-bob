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
  dateOfLastUpdate?: Date;
}>;

export type Post = Authorable &
  Readonly<{
    dateOfLastComment?: Date;
    title: string;
    content: RawDraftContentState;
    comments?: Collection<DocumentId, Comment>;
  }>;

export type NewPostDocument = Overwrite<
  Omit<Post, 'id' | 'dateOfLastUpdate' | 'dateOfLastComment' | 'comments'>,
  { dateOfCreation: firestore.FieldValue }
>;

export type Comment = Authorable &
  Readonly<{
    content: string;
  }>;
