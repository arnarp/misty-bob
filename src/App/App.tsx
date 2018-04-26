import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import * as firebase from 'firebase/app';
import { Routes } from './Routes';
import './App.css';
import { auth, messaging, refreshFCMToken, firestore } from '../firebase';
import { b64DecodeUnicode } from '../Utils/converters';
import { UserClaims, UserInfo, UserMeta, mapDocument } from 'src/types';
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
  userMeta: undefined as undefined | UserMeta,
};
type AppState = Readonly<typeof initialState>;

export class App extends React.Component<{}, AppState> {
  unsubscribeToUserMeta: () => void;
  readonly subscriptions: Array<() => void> = [];
  readonly state: AppState = initialState;

  componentDidMount() {
    this.subscribeToAuthStateChanged();
  }
  componentWillUnmount() {
    this.subscriptions.forEach(u => u());
  }
  async componentDidUpdate(prevProps: {}, prevState: AppState) {
    if (!prevState.userInfo && this.state.userInfo) {
      this.subscribeToUserMeta();
    }
    if (prevState.userInfo && !this.state.userInfo) {
      this.unsubscribeToUserMeta();
    }
    if (
      this.state.userInfo &&
      prevState.userMeta &&
      this.state.userMeta &&
      prevState.userMeta.claimsRefreshTime !==
        this.state.userMeta.claimsRefreshTime
    ) {
      const userClaims = await getClaims(this.state.userInfo);
      this.setState(() => ({ userClaims }));
    }
  }

  render() {
    console.log('App render', this.state);
    return (
      <BrowserRouter>
        <>
          {this.state.userInfo !== undefined && (
            <AppBar userInfo={this.state.userInfo} onLogout={this.onLogout} />
          )}
          {this.state.userInfo !== undefined &&
            this.state.userMeta !== undefined && (
              <Routes
                userInfo={this.state.userInfo}
                userMeta={this.state.userMeta}
              />
            )}
        </>
      </BrowserRouter>
    );
  }
  private onLogout = () => {
    this.setState(() => ({ userClaims: undefined }));
  };
  private subscribeToAuthStateChanged() {
    const authStateSubscription = auth().onAuthStateChanged(async user => {
      console.log('onAuthStateChanged', user);
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
    });
    this.subscriptions.push(authStateSubscription);
  }
  private subscribeToUserMeta() {
    if (!this.state.userInfo) {
      return;
    }
    this.unsubscribeToUserMeta = firestore
      .collection('userMetas')
      .doc(this.state.userInfo.uid)
      .onSnapshot(doc => {
        if (doc.exists) {
          this.setState(() => ({
            userMeta: mapDocument<UserMeta>(doc as any),
          }));
        }
      });
    this.subscriptions.push(this.unsubscribeToUserMeta);
  }
}
