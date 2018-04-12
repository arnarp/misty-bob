import { DocumentId, Authorable } from '.';
import { Omit } from './Utils';

export type Like = Authorable &
  Readonly<{
    entityId: DocumentId;
    entityType: 'Post' | 'Comment';
  }>;

export type LikeDocument = Omit<Like, 'id'>;
