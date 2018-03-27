import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const config = {
  apiKey: 'AIzaSyA6nYFzdDsyffXCla8qNkGQNNSm-FEe5C0',
  authDomain: 'misty-bob.firebaseapp.com',
  databaseURL: 'https://misty-bob.firebaseio.com',
  projectId: 'misty-bob',
  storageBucket: '',
  messagingSenderId: '136623417703',
};

firebase.initializeApp(config);

export const firestore = firebase.firestore();
export const auth = firebase.auth;
