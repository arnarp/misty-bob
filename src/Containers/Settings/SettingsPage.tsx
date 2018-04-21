import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Col } from '../../Components';
import { FormattedDocumentTitle } from '../../Components/SideEffects';

type SettingsPageProps = {};

const initialState = {};
type SettingsPageState = Readonly<typeof initialState>;

export class SettingsPage extends React.PureComponent<
  SettingsPageProps,
  SettingsPageState
> {
  readonly state: SettingsPageState = initialState;

  render() {
    return (
      <Col as="main">
        <FormattedDocumentTitle id="settings" />
        <h1>
          <FormattedMessage id="settings" />
        </h1>
      </Col>
    );
  }
}
