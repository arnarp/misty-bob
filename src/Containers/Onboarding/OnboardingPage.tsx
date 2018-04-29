import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Col } from '../../Components';
import { UserMeta } from '../../types';

type OnboardingProps = {
  userMeta?: UserMeta;
};

const initialState = {};
type OnboardingState = Readonly<typeof initialState>;

export class OnboardingPage extends React.PureComponent<
  OnboardingProps,
  OnboardingState
> {
  readonly state: OnboardingState = initialState;

  render() {
    return (
      <Col as="main" sidePaddings="mediumResponsive">
        <h1>
          <FormattedMessage id="onboardingHeader" />
        </h1>
        {this.props.userMeta === undefined && (
          <p>
            <FormattedMessage id="onboardingCreatingUserMeta" />
          </p>
        )}
        {this.props.userMeta !== undefined && <p>Velja notendanafn</p>}
      </Col>
    );
  }
}
