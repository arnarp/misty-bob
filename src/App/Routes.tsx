import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { createAsyncComponent } from '../Components/AsyncComponent';
import { HomePage } from '../Containers/Home';
import { NotFoundPage } from '../Containers/NotFound';
import { CreateIndexPage } from '../Containers/Create';
import { UserInfo, UserMeta, UserClaims } from '../types';
import { DiscussionPage } from '../Containers/Discussion';

// const AsyncHome = createAsyncComponent(() =>
//   import('../Containers/Home').then(m => m.Home),
// );
const AsyncAdmin = createAsyncComponent(
  () => import('../Containers/Admin').then(m => m.Admin),
  () => <div>Loading...</div>,
);
const AsyncDev = createAsyncComponent(() =>
  import('../Containers/Dev').then(m => m.DevRoutes),
);
const AsyncSettingsPage = injectIntl(
  createAsyncComponent(() =>
    import('../Containers/Settings').then(m => m.SettingsPage),
  ),
);

type RoutesProps = {
  userInfo: UserInfo | null;
  userClaims?: UserClaims;
  userMeta?: UserMeta;
};

export const Routes: React.SFC<RoutesProps> = props => (
  <Switch>
    <Route path="/" exact component={HomePage} />
    <Route
      path="/create"
      render={() => {
        if (props.userInfo) {
          return (
            <CreateIndexPage
              userInfo={props.userInfo}
              userClaims={props.userClaims}
            />
          );
        }
        return null;
      }}
    />
    <Route
      path="/d/:id"
      render={p => (
        <DiscussionPage
          {...p}
          userInfo={props.userInfo}
          userClaims={props.userClaims}
        />
      )}
    />
    <Route
      path="/settings"
      render={() => {
        if (props.userMeta === undefined) {
          return null;
        }
        return (
          <AsyncSettingsPage
            userInfo={props.userInfo}
            userMeta={props.userMeta}
          />
        );
      }}
    />
    <Route path="/admin" component={AsyncAdmin} />
    <Route path="/dev" component={AsyncDev} />
    <Route component={NotFoundPage} />
  </Switch>
);
