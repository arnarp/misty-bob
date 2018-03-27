import { Post } from './Post';

export type Collection<K, V> = Map<K, V>;
export type DocumentId = string;

export type FirestoreSchema = {
  posts: Collection<DocumentId, Post>;
};

export function mapDocument<D>(d: {
  id: string;
  data: () => { [field: string]: any };
}): D {
  return <D> (<any> { ...d.data(), id: d.id });
}
