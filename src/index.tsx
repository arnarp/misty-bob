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
    }
  }
}

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
registerServiceWorker();
