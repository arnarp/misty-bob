import { User, firestore } from 'firebase/app';
import { Overwrite } from './Utils';
import { UID } from '.';

export type UserInfo = Overwrite<
  User,
  { displayName: string; photoURL: string }
>;

export type PublicUserInfo = {
  displayName: string;
  username: string;
  photoURL: string;
  uid: UID;
  registrationDate: Date;
};

export type NewPublicUserInfoDocument = Overwrite<
  PublicUserInfo,
  {
    registrationDate: firestore.FieldValue;
  }
>;
