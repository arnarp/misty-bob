import * as React from 'react';
import { FormattedMessage, InjectedIntlProps } from 'react-intl';
import { Col, PageHeader, Section } from '../../Components';
import { FormattedDocumentTitle } from '../../Components/SideEffects';
import { UserInfo, UserMeta, UserMetaDocument } from '../../types';
import { Toggle } from '../../Components/Inputs/Toggle';
import { RadioGroup } from '../../Components/Inputs/RadioGroup';

type SettingsPageProps = InjectedIntlProps & {
  userInfo: UserInfo | null;
  userMeta: UserMeta;
};

const initialState = {};
type SettingsPageState = Readonly<typeof initialState>;

export class SettingsPage extends React.PureComponent<
  SettingsPageProps,
  SettingsPageState
> {
  readonly state: SettingsPageState = initialState;
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
          <Col spacing="medium">
            <Toggle
              label={this.props.intl.formatMessage({
                id: 'settingsPageTurnOnNotificationsLabel',
              })}
              checked={this.props.userMeta.pushNotifications.enabled}
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
              disabled={this.props.userMeta.pushNotifications.enabled === false}
              value={this.props.userMeta.pushNotifications.comments}
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
              disabled={this.props.userMeta.pushNotifications.enabled === false}
              value={this.props.userMeta.pushNotifications.likes}
              onChange={this.onPushNotificationsLikesChange}
            />
          </Col>
        </Section>
      </Col>
    );
  }

  private onNotificationsEnabledChange = (value: boolean) => {
    const update: Partial<UserMetaDocument> = {
      pushNotifications: {
        ...this.props.userMeta.pushNotifications,
        enabled: value,
      },
    };
    this.updateUserMeta(update);
  };
  private onPushNotificationsCommentsChange = (value: 'all' | 'off') => {
    const update: Partial<UserMetaDocument> = {
      pushNotifications: {
        ...this.props.userMeta.pushNotifications,
        comments: value,
      },
    };
    this.updateUserMeta(update);
  };
  private onPushNotificationsLikesChange = (value: 'all' | 'off') => {
    const update: Partial<UserMetaDocument> = {
      pushNotifications: {
        ...this.props.userMeta.pushNotifications,
        likes: value,
      },
    };
    this.updateUserMeta(update);
  };
  private updateUserMeta(update: Partial<UserMetaDocument>) {
    this.props.userMeta.ref
      .update(update)
      .then(() => {
        console.log('UserMeta updated');
      })
      .catch((reason: any) => {
        console.log('UserMeta update rejected', reason);
      });
  }
}
