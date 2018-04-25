import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { firestore } from '../../firebase';
import { Col, PageHeader, Section } from '../../Components';
import { FormattedDocumentTitle } from '../../Components/SideEffects';
import { UserInfo, UserMeta, mapDocument, UserMetaDocument } from '../../types';
import { Toggle } from '../../Components/Inputs/Toggle';

type SettingsPageProps = {
  userInfo?: UserInfo | null;
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
            <>
              <FormattedMessage id="settingsPageTurnOnNotificationsLabel">
                {label => (
                  <Toggle
                    label={label}
                    checked={this.state.userMeta!.pushNotifications.enabled}
                    onChange={this.onNotificationsEnabledChange}
                    debounce
                  />
                )}
              </FormattedMessage>
            </>
          )}
        </Section>
      </Col>
    );
  }
  private subscribeToUserMeta() {
    console.log('subscribeToUserMeta');
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
    if (this.state.userMeta) {
      const update: Partial<UserMetaDocument> = {
        pushNotifications: {
          ...this.state.userMeta.pushNotifications,
          enabled: value,
        },
      };
      this.state.userMeta.ref
        .update(update)
        .then(() => {
          console.log('UserMeta updated');
        })
        .catch((reason: any) => {
          console.log('UserMeta update rejected', reason);
        });
    }
  };
}
