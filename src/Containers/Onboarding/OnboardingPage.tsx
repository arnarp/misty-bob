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
import { firestore, registerUsername } from '../../firebase';
import { debounce } from 'ts-debounce';

type OnboardingProps = {
  userMeta?: UserMeta;
  userInfo: UserInfo;
};

type State =
  | 'mounted'
  | 'creatingUserMeta'
  | 'userNameInput'
  | 'registeringUsername'
  | 'registeringUsernameDone';
type Action =
  | 'waitForUserMetaToBeCreated'
  | 'userMetaCreated'
  | 'registerUsername'
  | 'registerUsernameDone'
  | 'registerUsernameFailed';

const stateMachine: {
  readonly [currentState in State]: { readonly [action in Action]?: State }
} = {
  mounted: {
    waitForUserMetaToBeCreated: 'creatingUserMeta',
    userMetaCreated: 'userNameInput',
  },
  creatingUserMeta: {
    userMetaCreated: 'userNameInput',
  },
  userNameInput: {
    registerUsername: 'registeringUsername',
  },
  registeringUsername: {
    registerUsernameDone: 'registeringUsernameDone',
    registerUsernameFailed: 'userNameInput',
  },
  registeringUsernameDone: {},
};

const nextState = (prevState: State, action: Action) => {
  return stateMachine[prevState][action] || prevState;
};

const initialState = {
  state: 'mounted' as State,
  userNameInput: '',
  userNameInputError: null as React.ReactNode,
  userNameIsAvailable: {} as {
    [username: string]: 'available' | 'unavailable' | 'loading' | 'error';
  },
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

  componentDidMount() {
    const action: Action =
      this.props.userMeta === undefined
        ? 'waitForUserMetaToBeCreated'
        : 'userMetaCreated';
    this.setState(prevState => ({ state: nextState(prevState.state, action) }));
  }

  componentDidUpdate(prevProps: OnboardingProps, prevState: OnboardingState) {
    if (
      this.state.userNameInput !== '' &&
      this.state.userNameInputError === null &&
      prevState.userNameInput !== this.state.userNameInput
    ) {
      if (
        this.state.userNameIsAvailable[this.state.userNameInput] === undefined
      ) {
        this.setState(p => ({
          userNameIsAvailable: {
            ...p.userNameIsAvailable,
            [this.state.userNameInput]: 'loading',
          },
        }));
      }
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
        {this.state.state === 'creatingUserMeta' && (
          <p>
            <FormattedMessage id="obpCreatingUserMeta" />
          </p>
        )}
        {['userNameInput', 'registeringUsername'].findIndex(
          i => i === this.state.state,
        ) !== -1 && (
          <>
            <p>
              <FormattedMessage id="obpDescription" />
            </p>
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
                  loading={
                    this.state.userNameIsAvailable[this.state.userNameInput] ===
                      'loading' || this.state.state === 'registeringUsername'
                  }
                  hasClickedSubmit={
                    this.state.userNameIsAvailable[this.state.userNameInput] ===
                    'unavailable'
                  }
                  errorMessage={
                    this.state.userNameIsAvailable[this.state.userNameInput] ===
                    'unavailable' ? (
                      <FormattedMessage id="obpUsernameTakenInputError" />
                    ) : (
                      this.state.userNameInputError
                    )
                  }
                  successMessage={
                    this.state.userNameIsAvailable[this.state.userNameInput] ===
                    'available' ? (
                      <FormattedMessage id="obpUserNameAvailable" />
                    ) : null
                  }
                />
                <Button
                  disabled={
                    this.state.userNameInputError !== null ||
                    this.state.userNameIsAvailable[this.state.userNameInput] ===
                      'unavailable' ||
                    this.state.state === 'registeringUsername'
                  }
                  width="fit-content"
                  type="submit"
                  color="default"
                >
                  <FormattedMessage id="obpChooseUsernameBtn" />
                </Button>
              </Col>
            </form>
          </>
        )}
        {this.state.state === 'registeringUsernameDone' && (
          <p>
            <FormattedMessage id="obpUsernameRegistered" />
          </p>
        )}
      </Col>
    );
  }
  private checkIfUserNameIsAvailable = () => {
    console.log('checkIfUserNameIsAvailable');
    const userNameToCheck = this.state.userNameInput;
    if (
      this.state.userNameIsAvailable[userNameToCheck] === 'unavailable' ||
      reduceValidators(this.unValidators, userNameToCheck) !== null
    ) {
      return;
    }
    this.setState(prevState => ({
      userNameIsAvailable: {
        ...prevState.userNameIsAvailable,
        [userNameToCheck]: 'loading',
      },
    }));
    console.log('checkIfUserNameIsAvailable', userNameToCheck);
    firestore
      .collection('publicUserInfos')
      .doc(userNameToCheck)
      .get()
      .then(snapshot => {
        this.setState(prevState => ({
          userNameIsAvailable: {
            ...prevState.userNameIsAvailable,
            [userNameToCheck]: snapshot.exists ? 'unavailable' : 'available',
          },
        }));
      })
      .catch(() => {
        this.setState(prevState => ({
          userNameIsAvailable: {
            ...prevState.userNameIsAvailable,
            [userNameToCheck]: 'error',
          },
        }));
      });
  };
  private onUserNameFormSubmit = (event: React.FormEvent<{}>) => {
    event.preventDefault();
    if (this.state.userNameInputError) {
      return;
    }
    this.setState(prevState => ({
      state: nextState(prevState.state, 'registerUsername'),
    }));
    registerUsername(this.state.userNameInput)
      .then(() => {
        this.setState(prevState => ({
          state: nextState(prevState.state, 'registerUsernameDone'),
        }));
      })
      .catch(reason => {
        console.log('Register failed', reason);
        this.setState(prevState => ({
          state: nextState(prevState.state, 'registerUsernameFailed'),
          userNameInputError: 'Failed  to register',
        }));
      });
  };
}
