import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Col, Button, Text } from '../../Components';
import {
  TextInput,
  RequiredTextInputValidator,
  MinLengthTextInputValidator,
  reduceValidators,
} from '../../Components/Inputs';
import { UserMeta, UserInfo } from '../../types';
import { Avatar } from '../../Components/Discussions/Avatar';
import { firestore } from '../../firebase';
import { debounce } from 'ts-debounce';

type OnboardingProps = {
  userMeta?: UserMeta;
  userInfo: UserInfo;
};

const initialState = {
  userNameInput: '',
  userNameInputError: null as React.ReactNode,
  userNameIsAvailable: undefined as undefined | boolean,
};
type OnboardingState = Readonly<typeof initialState>;

export class OnboardingPage extends React.PureComponent<
  OnboardingProps,
  OnboardingState
> {
  debouncedCheckIfUserNameIsAvailable: () => void;
  readonly state: OnboardingState = initialState;
  readonly unValidators = [
    RequiredTextInputValidator,
    MinLengthTextInputValidator(2, 'obpMinLenght'),
  ];

  constructor(props: OnboardingProps) {
    super(props);
    this.debouncedCheckIfUserNameIsAvailable = debounce(
      this.checkIfUserNameIsAvailable,
      1000,
    );
  }

  componentDidUpdate(prevProps: OnboardingProps, prevState: OnboardingState) {
    if (
      this.state.userNameInput !== '' &&
      this.state.userNameInputError === null &&
      prevState.userNameInput !== this.state.userNameInput
    ) {
      this.setState(() => ({ userNameIsAvailable: undefined }));
      this.debouncedCheckIfUserNameIsAvailable();
    }
  }
  render() {
    console.log('obp render', this.props, this.state);
    return (
      <Col
        as="main"
        sidePaddings="mediumResponsive"
        sideMargins="auto"
        maxWidth="small"
        spacing="medium"
      >
        <Text.Header level={1} center>
          <FormattedMessage id="obpHeader" />
        </Text.Header>
        <Col alignItems="center" spacing="medium">
          <Avatar photoURL={this.props.userInfo.photoURL} size="xLarge" />
          <Text.Secondary>{this.props.userInfo.displayName}</Text.Secondary>
        </Col>
        {this.props.userMeta === undefined && (
          <p>
            <FormattedMessage id="obpCreatingUserMeta" />
          </p>
        )}
        {this.props.userMeta !== undefined && (
          <form noValidate onSubmit={this.onUserNameFormSubmit}>
            <Col spacing="medium" alignItems="center">
              <TextInput
                label={<FormattedMessage id="obpUserNameInputLabel" />}
                value={this.state.userNameInput}
                onChange={value =>
                  this.setState(() => ({
                    userNameInput: value,
                    userNameInputError: reduceValidators(
                      this.unValidators,
                      value,
                    ),
                  }))
                }
                errorMessage={this.state.userNameInputError}
                successMessage={
                  this.state.userNameIsAvailable ? (
                    <FormattedMessage id="obpUserNameAvailable" />
                  ) : null
                }
              />
              <Button
                disabled={
                  this.state.userNameInputError !== null ||
                  !this.state.userNameIsAvailable
                }
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
  private checkIfUserNameIsAvailable = () => {
    console.log('checkIfUserNameIsAvailable');
    firestore
      .collection('publicUserInfo')
      .doc(this.state.userNameInput)
      .get()
      .then(snapshot => {
        this.setState(() => ({ userNameIsAvailable: !snapshot.exists }));
      });
  };
  private onUserNameFormSubmit = () => {};
}
