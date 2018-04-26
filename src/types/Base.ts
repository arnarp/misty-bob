import { firestore } from 'firebase';
import { Overwrite, Omit } from '.';

export type DocumentId = string;
export type UID = string;

export type BaseDocument = Readonly<{
  id: DocumentId;
  ref: firestore.DocumentReference;
}>;

/**
 * Base for user authored content.
 * Extended by Post, Comment.
 * Remember to edit firestore.rules for all who extend this
 * when changing this interface.
 */
export type Authorable = BaseDocument &
  Readonly<{
    authorUid: UID;
    authorName: string;
    authorPhotoURL: string;
    /**
     * Can be null for a brief moment after creation, before it has
     * been synced to the firestore and gotten the firestore.FieldValue.
     */
    dateOfCreation: Date | null;
  }>;

export type AuthorableDocument = Omit<Authorable, 'id' | 'ref'>;

export type NewAuthorableDocument = Overwrite<
  Omit<Authorable, 'id' | 'ref'>,
  {
    dateOfCreation: firestore.FieldValue;
  }
>;

export type Editable = Readonly<{
  dateOfLastEdit?: Date;
}>;

export type Likeable = Readonly<{
  numberOfLikes: number;
}>;
