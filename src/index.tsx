import 'normalize.css';
import './index.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './App';
import registerServiceWorker from './registerServiceWorker';
import { addLocaleData, IntlProvider } from 'react-intl';
import * as isLocaleData from 'react-intl/locale-data/is';
import * as enLocaleData from 'react-intl/locale-data/en';
import { localeStrToLocale } from './Utils/localeStrToLocale';

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

const locale = localeStrToLocale(navigator.language);
const messagesIS = {
  sendReply: 'Senda svar',
  writeAReplyPlaceholder: 'Skrifaðu athugasemd',
  numberOfComments: '{numberOfComments} ummæli',
  settings: 'Stillingar',
  logoutBtn: 'Útskráning',
  settingsPageNotificationsH2: 'Tilkynningar',
  settingsPageTurnOnNotificationsLabel: 'Tilkynningar',
  settingsPageCommentsRadioLegend: 'Athugasemdir',
  settingsPageLikesRadioLegend: 'Likes',
  settingsPageRadioOptionAll: 'Allar',
  settingsPageRadioOptionOff: 'Engar',
};
const messagesEN = {
  sendReply: 'Reply',
  writeAReplyPlaceholder: 'Write a reply',
  numberOfComments: '{numberOfComments} comments',
  settings: 'Settings',
  logoutBtn: 'Log out',
  settingsPageNotificationsH2: 'Push notifications',
  settingsPageTurnOnNotificationsLabel: 'Push notifications',
  settingsPageCommentsRadioLegend: 'Comments',
  settingsPageLikesRadioLegend: 'Likes',
  settingsPageRadioOptionAll: 'All',
  settingsPageRadioOptionOff: 'None',
};
const messages = locale === 'is' ? messagesIS : messagesEN;

ReactDOM.render(
  <IntlProvider locale={locale} messages={messages}>
    <App />
  </IntlProvider>,
  document.getElementById('root') as HTMLElement,
);
registerServiceWorker();
