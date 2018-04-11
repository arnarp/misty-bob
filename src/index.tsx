import 'normalize.css';
import './index.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './App';
import registerServiceWorker from './registerServiceWorker';

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
    }
  }
}

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
registerServiceWorker();

console.log(
  'FIREBASE_API_KEY',
  process.env.REACT_APP_FIREBASE_API_KEY,
  process.env,
);
