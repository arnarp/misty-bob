import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import * as firebase from 'firebase/app';
import { auth, messaging, refreshFCMToken, firestore } from '../firebase';
import { Routes } from './Routes';
import { OnboardingPage } from '../Containers/Onboarding';
import { b64DecodeUnicode } from '../Utils/converters';
import { UserClaims, UserInfo, UserMeta, mapDocument } from 'src/types';
import { AppBar } from './AppBar';

async function getClaims(
  user: firebase.User | null,
  options: { forceRefresh: boolean } = { forceRefresh: false },
) {
  if (user === null) {
    return undefined;
  }
  return user.getIdToken(options.forceRefresh).then(token => {
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
      const userClaims = await getClaims(this.state.userInfo, {
        forceRefresh: true,
      });
      this.setState(() => ({ userClaims }));
    }
  }

  render() {
    console.log('App render', this.state);
    return (
      <BrowserRouter>
        <>
          {this.renderAppBar(this.state.userInfo, this.state.userMeta) && (
            <AppBar userInfo={this.state.userInfo} onLogout={this.onLogout} />
          )}
          {this.renderRoutes(this.state.userInfo, this.state.userMeta) && (
            <Routes
              userInfo={this.state.userInfo}
              userClaims={this.state.userClaims}
              userMeta={this.state.userMeta}
            />
          )}
          {this.renderOnboarding(this.state.userInfo, this.state.userMeta) && (
            <OnboardingPage
              userMeta={this.state.userMeta}
              userInfo={this.state.userInfo}
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
    const authStateSubscription = auth().onAuthStateChanged(
      async user => {
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
      },
      error => {
        console.log('App onAuthStateChanged error', error);
      },
    );
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
  private renderAppBar(
    userInfo: UserInfo | null | undefined,
    userMeta: undefined | UserMeta,
  ): userInfo is UserInfo | null {
    if (this.renderOnboarding(userInfo, userMeta)) {
      return false;
    }
    if (userInfo === null) {
      return true;
    }
    return userInfo !== undefined && userMeta !== undefined;
  }
  private renderRoutes(
    userInfo: UserInfo | null | undefined,
    userMeta: undefined | UserMeta,
  ): userInfo is UserInfo | null {
    if (this.state.userInfo === undefined) {
      return false;
    }
    if (this.renderOnboarding(userInfo, userMeta)) {
      return false;
    }
    return userInfo === null || this.state.userMeta !== undefined;
  }
  private renderOnboarding(
    userInfo: UserInfo | null | undefined,
    userMeta: undefined | UserMeta,
  ): userInfo is UserInfo {
    return Boolean(userInfo && userMeta && !userMeta.claims.username);
  }
}
