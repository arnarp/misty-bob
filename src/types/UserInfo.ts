import { UserInfo as FirebaseUserInfo } from 'firebase/app';
import { Overwrite } from './Utils';

export type UserInfo = Overwrite<
  FirebaseUserInfo,
  { displayName: string; photoURL: string }
>;
