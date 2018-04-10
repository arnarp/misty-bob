import { PostDocument } from './Post';
import { UserMetaDocument } from './UserMeta';

export type Collection<K, V> = Map<K, V>;
export type DocumentId = string;
export type UID = string;

export type FirestoreSchema = {
  posts: Collection<DocumentId, PostDocument>;
  userMetas: Collection<UID, UserMetaDocument>;
};

export function mapDocument<D>(d: {
  id: string;
  data: () => { [field: string]: any } | undefined;
}): D {
  return <D>(<any>{ ...d.data(), id: d.id });
}
