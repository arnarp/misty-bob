import * as React from 'react';
import { FormattedMessage, InjectedIntlProps } from 'react-intl';
import { firestore } from '../../firebase';
import { Col, PageHeader, Section } from '../../Components';
import { FormattedDocumentTitle } from '../../Components/SideEffects';
import { UserInfo, UserMeta, mapDocument, UserMetaDocument } from '../../types';
import { Toggle } from '../../Components/Inputs/Toggle';
import { RadioGroup } from '../../Components/Inputs/RadioGroup';

type SettingsPageProps = InjectedIntlProps & {
  userInfo: UserInfo | null;
};

const initialState = {
  userMeta: undefined as undefined | UserMeta,
};
type SettingsPageState = Readonly<typeof initialState>;

export class SettingsPage extends React.PureComponent<
  SettingsPageProps,
  SettingsPageState
> {
  readonly state: SettingsPageState = initialState;
  readonly subscriptions: Array<() => void> = [];

  componentDidMount() {
    this.subscribeToUserMeta();
  }

  componentDidUpdate(prevProps: SettingsPageProps) {
    if (!prevProps.userInfo && this.props.userInfo) {
      this.subscribeToUserMeta();
    }
  }

  componentWillUnmount() {
    this.subscriptions.forEach(u => u());
  }
  render() {
    console.log('Settings render', this.props);
    return (
      <Col as="main">
        <FormattedDocumentTitle id="settings" />
        <PageHeader>
          <FormattedMessage id="settings" />
        </PageHeader>
        <Section sidePaddings="mediumResponsive">
          <h2>
            <FormattedMessage id="settingsPageNotificationsH2" />
          </h2>
          {this.state.userMeta && (
            <Col spacing="medium">
              <Toggle
                label={this.props.intl.formatMessage({
                  id: 'settingsPageTurnOnNotificationsLabel',
                })}
                checked={this.state.userMeta.pushNotifications.enabled}
                onChange={this.onNotificationsEnabledChange}
                debounce
              />
              <RadioGroup
                legend={this.props.intl.formatMessage({
                  id: 'settingsPageCommentsRadioLegend',
                })}
                options={[
                  {
                    label: this.props.intl.formatMessage({
                      id: 'settingsPageRadioOptionAll',
                    }),
                    value: 'all',
                  },
                  {
                    label: this.props.intl.formatMessage({
                      id: 'settingsPageRadioOptionOff',
                    }),
                    value: 'off',
                  },
                ]}
                disabled={
                  this.state.userMeta.pushNotifications.enabled === false
                }
                value={this.state.userMeta.pushNotifications.comments}
                onChange={this.onPushNotificationsCommentsChange}
              />
              <RadioGroup
                legend={this.props.intl.formatMessage({
                  id: 'settingsPageLikesRadioLegend',
                })}
                options={[
                  {
                    label: this.props.intl.formatMessage({
                      id: 'settingsPageRadioOptionAll',
                    }),
                    value: 'all',
                  },
                  {
                    label: this.props.intl.formatMessage({
                      id: 'settingsPageRadioOptionOff',
                    }),
                    value: 'off',
                  },
                ]}
                disabled={
                  this.state.userMeta.pushNotifications.enabled === false
                }
                value={this.state.userMeta.pushNotifications.likes}
                onChange={this.onPushNotificationsLikesChange}
              />
            </Col>
          )}
        </Section>
      </Col>
    );
  }
  private subscribeToUserMeta() {
    if (!this.props.userInfo) {
      return;
    }
    const userMetaSubscription = firestore
      .collection('userMetas')
      .doc(this.props.userInfo.uid)
      .onSnapshot(doc => {
        if (doc.exists) {
          this.setState(() => ({
            userMeta: mapDocument<UserMeta>(doc as any),
          }));
        }
      });
    this.subscriptions.push(userMetaSubscription);
  }
  private onNotificationsEnabledChange = (value: boolean) => {
    if (this.state.userMeta === undefined) {
      return;
    }
    const update: Partial<UserMetaDocument> = {
      pushNotifications: {
        ...this.state.userMeta.pushNotifications,
        enabled: value,
      },
    };
    this.updateUserMeta(update);
  };
  private onPushNotificationsCommentsChange = (value: 'all' | 'off') => {
    if (this.state.userMeta === undefined) {
      return;
    }
    const update: Partial<UserMetaDocument> = {
      pushNotifications: {
        ...this.state.userMeta.pushNotifications,
        comments: value,
      },
    };
    this.updateUserMeta(update);
  };
  private onPushNotificationsLikesChange = (value: 'all' | 'off') => {
    if (this.state.userMeta === undefined) {
      return;
    }
    const update: Partial<UserMetaDocument> = {
      pushNotifications: {
        ...this.state.userMeta.pushNotifications,
        likes: value,
      },
    };
    this.updateUserMeta(update);
  };
  private updateUserMeta(update: Partial<UserMetaDocument>) {
    if (this.state.userMeta === undefined) {
      return;
    }
    this.state.userMeta.ref
      .update(update)
      .then(() => {
        console.log('UserMeta updated');
      })
      .catch((reason: any) => {
        console.log('UserMeta update rejected', reason);
      });
  }
}
