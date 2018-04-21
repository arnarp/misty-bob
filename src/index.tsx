import 'normalize.css';
import './index.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './App';
import registerServiceWorker from './registerServiceWorker';
import { addLocaleData, IntlProvider } from 'react-intl';
import * as isLocaleData from 'react-intl/locale-data/is';
import * as enLocaleData from 'react-intl/locale-data/en';

addLocaleData([...isLocaleData, ...enLocaleData]);

declare global {
  const enum Env {
    Prod = 'production',
    Test = 'test',
    Dev = 'development',
  }
  interface HTMLElement {
    inert: boolean;
  }
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: Env;
      REACT_APP_FIREBASE_API_KEY: string;
      REACT_APP_FIREBASE_AUTH_DOMAIN: string;
      REACT_APP_FIREBASE_DATABASE_URL: string;
      REACT_APP_FIREBASE_PROJECT_ID: string;
      REACT_APP_FIREBASE_STORAGE_BUCKET: string;
      REACT_APP_FIREBASE_MESSAGING_SENDER_ID: string;
      REACT_APP_FIREBASE_MESSAGING_PUBLIC_VAPID_KEY: string;
    }
  }
}

const locale = navigator.language === 'is' ? 'is' : 'en';
const messagesIS = {
  sendReply: 'Senda svar',
  writeAReplyPlaceholder: 'Skrifaðu athugasemd',
  numberOfComments: '{numberOfComments} ummæli',
  settings: 'Stillingar',
  logoutBtn: 'Útskráning',
};
const messagesEN = {
  sendReply: 'Reply',
  writeAReplyPlaceholder: 'Write a reply',
  numberOfComments: '{numberOfComments} comments',
  settings: 'Settings',
  logoutBtn: 'Log out',
};
const messages = locale === 'is' ? messagesIS : messagesEN;

ReactDOM.render(
  <IntlProvider locale={locale} messages={messages}>
    <App />
  </IntlProvider>,
  document.getElementById('root') as HTMLElement,
);
registerServiceWorker();
