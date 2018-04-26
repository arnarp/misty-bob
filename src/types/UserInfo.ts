import { User } from 'firebase/app';
import { Overwrite } from './Utils';
import { UID } from '.';

export type UserInfo = Overwrite<
  User,
  { displayName: string; photoURL: string }
>;

export type PublicUserInfo = {
  displayName: string;
  uName: string;
  photoURL: string;
  uid: UID;
  registrationDate: Date;
};
