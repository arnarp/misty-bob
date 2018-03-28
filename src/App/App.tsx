import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Routes } from './Routes';
import './App.css';
import { auth } from '../firebase';
import { b64DecodeUnicode } from '../Utils/converters';
import { UserClaims, UserInfo } from 'src/types';
import { AppBar } from './AppBar';

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
    this.removeAuthStateChangeListener = auth().onAuthStateChanged(user => {
      if (user) {
        user.getIdToken().then(idToken => {
          const userClaims = JSON.parse(
            b64DecodeUnicode(idToken.split('.')[1]),
          );
          this.setState(() => ({ userClaims }));
        });
      }
      this.setState(() => ({ userInfo: user as UserInfo }));
    });
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
