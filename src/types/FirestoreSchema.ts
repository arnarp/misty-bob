import { firestore } from 'firebase';
import {
  LikeDocument,
  PostDocument,
  UserMetaDocument,
  DocumentId,
  UID,
  BaseDocument,
  Action,
  PublicUserInfo,
} from '.';

export type Collection<K, V> = Map<K, V>;

type Username = string;

export type FirestoreSchema = {
  posts: Collection<DocumentId, PostDocument>;
  likes: Collection<DocumentId, LikeDocument>;
  userMetas: Collection<UID, UserMetaDocument>;
  actions: Collection<DocumentId, Action>;
  publicUserInfo: Collection<Username, PublicUserInfo>;
};

export function mapDocument<D extends BaseDocument>(
  d: firestore.DocumentSnapshot,
): D {
  return <D>(<any>{ ...d.data(), id: d.id, ref: d.ref });
}
