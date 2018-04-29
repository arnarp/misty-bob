import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Col, Button } from '../../Components';
import {
  TextInput,
  RequiredTextInputValidator,
  MinLengthTextInputValidator,
  reduceValidators,
} from '../../Components/Inputs';
import { UserMeta } from '../../types';

type OnboardingProps = {
  userMeta?: UserMeta;
};

const initialState = {
  userNameInput: '',
};
type OnboardingState = Readonly<typeof initialState>;

export class OnboardingPage extends React.PureComponent<
  OnboardingProps,
  OnboardingState
> {
  readonly state: OnboardingState = initialState;
  readonly unValidators = [
    RequiredTextInputValidator,
    MinLengthTextInputValidator(2, 'obpMinLenght'),
  ];

  render() {
    const userNameInputError = reduceValidators(
      this.unValidators,
      this.state.userNameInput,
    );
    return (
      <Col as="main" sidePaddings="mediumResponsive">
        <h1>
          <FormattedMessage id="obpHeader" />
        </h1>
        {this.props.userMeta === undefined && (
          <p>
            <FormattedMessage id="obpCreatingUserMeta" />
          </p>
        )}
        {this.props.userMeta !== undefined && (
          <form noValidate onSubmit={this.onUserNameFormSubmit}>
            <Col spacing="medium" maxWidth="medium">
              <TextInput
                label={<FormattedMessage id="obpUserNameInputLabel" />}
                value={this.state.userNameInput}
                onChange={value =>
                  this.setState(() => ({ userNameInput: value }))
                }
                errorMessage={userNameInputError}
              />
              <Button
                disabled={userNameInputError !== null}
                width="fit-content"
                type="submit"
                color="default"
              >
                Halda áfram
              </Button>
            </Col>
          </form>
        )}
      </Col>
    );
  }
  private onUserNameFormSubmit = () => {};
}
