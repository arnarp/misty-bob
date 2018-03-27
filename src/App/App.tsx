import * as React from 'react';
import { User } from 'firebase/app';
import { BrowserRouter } from 'react-router-dom';
import { Routes } from './Routes';
import './App.css';
import { auth } from '../firebase';
import { b64DecodeUnicode } from '../Utils/converters';
import { UserClaims } from '../types/UserTokens';
import { AppBar } from './AppBar';

const initialState = {
  user: undefined as User | null | undefined,
  userClaims: undefined as UserClaims | undefined,
  initialized: false,
};
type AppState = Readonly<typeof initialState>;

export class App extends React.Component<{}, AppState> {
  removeAuthStateChangeListener: () => void;
  readonly state: AppState = initialState;

  componentDidMount() {
    this.removeAuthStateChangeListener = auth().onAuthStateChanged(user => {
      if (user) {
        user.getIdToken().then(idToken => {
          const userClaims = JSON.parse(
            b64DecodeUnicode(idToken.split('.')[1]),
          );
          this.setState(() => ({ userClaims }));
        });
      }
      this.setState(() => ({ user }));
    });
  }
  componentWillUnmount() {
    this.removeAuthStateChangeListener();
  }

  render() {
    return (
      <BrowserRouter>
        <>
          <AppBar user={this.state.user} onLogout={this.onLogout} />
          <Routes user={this.state.user} />
        </>
      </BrowserRouter>
    );
  }
  private onLogout = () => {
    this.setState(() => ({ userClaims: undefined }));
  };
}
