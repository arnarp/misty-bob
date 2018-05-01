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
  // obp - Onboarding page
  obpHeader: 'Velkomin',
  obpCreatingUserMeta: 'Augnablik. Verið er að setja upp notanda.',
  obpDescription:
    'Til að ljúka skráningu þarf að velja notendanafn. Það er notað þegar annar notandi vill hafa orð á þér (@mention) og í slóð prófíl síðu.',
  obpUserNameInputLabel: 'Veljið notandanafn',
  obpMinLenght: 'Notandanafn þarf að vera a.m.k. {minLength} stafir',
  obpUserNameAvailable: 'Notandanafn er laust',
  // tiv - Text input validators
  tivMinLenght: 'Inntak þarf að vera a.m.k. {minLength} stafir',
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
  // obp - Onboarding page
  obpHeader: 'Welcome',
  obpCreatingUserMeta: 'User account is being set up',
  obpDescription:
    'To finish registration a username needs to be chosen. It is used both in mentions and in profile page url.',
  obpUserNameInputLabel: 'Choose username',
  obpMinLenght: 'Username needs to be at least {minLength} characters',
  obpUserNameAvailable: 'Username is available',
  // tiv - Text input validators
  tivMinLenght: 'Input needs to be at least {minLength} characters',
};
const messages = locale === 'is' ? messagesIS : messagesEN;

ReactDOM.render(
  <IntlProvider locale={locale} messages={messages}>
    <App />
  </IntlProvider>,
  document.getElementById('root') as HTMLElement,
);
registerServiceWorker();
