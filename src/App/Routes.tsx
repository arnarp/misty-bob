import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { createAsyncComponent } from '../Components/AsyncComponent';
import { HomePage } from '../Containers/Home';
import { NotFoundPage } from '../Containers/NotFound';
import { CreateIndexPage } from '../Containers/Create';
import { UserInfo } from 'src/types';

// const AsyncHome = createAsyncComponent(() =>
//   import('../Containers/Home').then(m => m.Home),
// );
const AsyncAdmin = createAsyncComponent(
  () => import('../Containers/Admin').then(m => m.Admin),
  () => <div>Loading...</div>,
);
const AsyncTestBench = createAsyncComponent(() =>
  import('../Containers/TestBench').then(m => m.TestBench),
);

type RoutesProps = {
  userInfo?: UserInfo | null;
};

export const Routes: React.SFC<RoutesProps> = props => (
  <Switch>
    <Route path="/" exact component={HomePage} />
    <Route
      path="/create"
      render={() => {
        if (props.userInfo) {
          return <CreateIndexPage userInfo={props.userInfo} />;
        }
        return null;
      }}
    />
    <Route path="/admin" component={AsyncAdmin} />
    <Route path="/test" component={AsyncTestBench} />
    <Route component={NotFoundPage} />
  </Switch>
);
