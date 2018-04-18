import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import * as firebase from 'firebase/app';
import { Routes } from './Routes';
import './App.css';
import { auth, messaging, refreshFCMToken } from '../firebase';
import { b64DecodeUnicode } from '../Utils/converters';
import { UserClaims, UserInfo } from 'src/types';
import { AppBar } from './AppBar';

async function getClaims(user: firebase.User | null) {
  if (user === null) {
    return undefined;
  }
  return user.getIdToken().then(token => {
    return JSON.parse(b64DecodeUnicode(token.split('.')[1])) as UserClaims;
  });
}

const initialState = {
  userInfo: undefined as UserInfo | null | undefined,
  userClaims: undefined as UserClaims | undefined,
  initialized: false,
};
type AppState = Readonly<typeof initialState>;

export class App extends React.Component<{}, AppState> {
  removeAuthStateChangeListener: () => void;
  readonly state: AppState = initialState;

  componentDidMount() {
    this.removeAuthStateChangeListener = auth().onAuthStateChanged(
      async user => {
        const userClaims = await getClaims(user);
        this.setState(() => ({ userInfo: user as UserInfo, userClaims }));
        if (user === null) {
          return;
        }
        if (process.env.NODE_ENV === 'production') {
          const messagingRequestPermisson = messaging.requestPermission();
          if (messagingRequestPermisson === null) {
            return;
          }
          console.log('messagingRequestPermisson');
          messagingRequestPermisson
            .then(() => {
              console.log('Notification permission granted.');
              const getTokenPromise = messaging.getToken();
              if (getTokenPromise === null) {
                return;
              }
              getTokenPromise
                .then((refreshedToken: string) => {
                  console.log('Token refreshed.', refreshedToken);
                  refreshFCMToken().catch(result => {
                    console.log('httpsCallableResult error', result);
                  });
                })
                .catch((err: any) => {
                  console.log('Unable to retrieve refreshed token ', err);
                });
            })
            .catch((err: any) => {
              console.log('Unable to get permission to notify.', err);
            });
        }
      },
    );
  }
  componentWillUnmount() {
    this.removeAuthStateChangeListener();
  }

  render() {
    return (
      <BrowserRouter>
        <>
          <AppBar userInfo={this.state.userInfo} onLogout={this.onLogout} />
          <Routes userInfo={this.state.userInfo} />
        </>
      </BrowserRouter>
    );
  }
  private onLogout = () => {
    this.setState(() => ({ userClaims: undefined }));
  };
}
