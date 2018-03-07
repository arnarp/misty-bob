import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { createAsyncComponent } from '../Components/AsyncComponent';
import { Home } from '../Containers/Home';

// const AsyncHome = createAsyncComponent(() =>
//   import('../Containers/Home').then(m => m.Home),
// );
const AsyncAdmin = createAsyncComponent(() =>
  import('../Containers/Admin').then(m => m.Admin),
);

export const Routes = () => (
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/admin" component={AsyncAdmin} />
  </Switch>
);
