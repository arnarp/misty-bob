import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import * as firebase from 'firebase';
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

const enum State {
  Mounted = 'm',
  CreatingUserMeta = 'c',
  UserNameInput = 'u',
  RegisteringUsername = 'r',
  RegisteringUsernameDone = 'd',
}

const enum Action {
  WaitForUserMetaToBeCreated = 'W',
  UserMetaCreated = 'U',
  RegisterUsername = 'RU',
  RegisterUsernameDone = 'RUD',
  RegisterUsernameFailed = 'RUF',
}

const stateMachine: {
  readonly [currentState in State]: { readonly [action in Action]?: State }
} = {
  [State.Mounted]: {
    [Action.WaitForUserMetaToBeCreated]: State.CreatingUserMeta,
    [Action.UserMetaCreated]: State.UserNameInput,
  },
  [State.CreatingUserMeta]: {
    [Action.UserMetaCreated]: State.UserNameInput,
  },
  [State.UserNameInput]: {
    [Action.RegisterUsername]: State.RegisteringUsername,
  },
  [State.RegisteringUsername]: {
    [Action.RegisterUsernameDone]: State.RegisteringUsernameDone,
    [Action.RegisterUsernameFailed]: State.UserNameInput,
  },
  [State.RegisteringUsernameDone]: {},
};

const nextState = (prevState: State, action: Action) => {
  return stateMachine[prevState][action] || prevState;
};

const enum UsernameAvailability {
  Available = 'A',
  Unavailable = 'U',
  Loading = 'L',
  Error = 'E',
}

const initialState = {
  state: State.Mounted,
  userNameInput: '',
  userNameInputError: null as React.ReactNode,
  userNameIsAvailable: {} as {
    [username: string]: UsernameAvailability;
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
        ? Action.WaitForUserMetaToBeCreated
        : Action.UserMetaCreated;
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
            [this.state.userNameInput]: UsernameAvailability.Loading,
          },
        }));
      }
      this.debouncedCheckIfUserNameIsAvailable();
    }
    if (this.props.userMeta && !prevProps.userMeta) {
      this.setState(ps => ({
        state: nextState(ps.state, Action.UserMetaCreated),
      }));
    }
  }
  render() {
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
        {this.state.state === State.CreatingUserMeta && (
          <p>
            <FormattedMessage id="obpCreatingUserMeta" />
          </p>
        )}
        {[State.UserNameInput, State.RegisteringUsername].includes(
          this.state.state,
        ) && (
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
                      UsernameAvailability.Loading ||
                    this.state.state === State.RegisteringUsername
                  }
                  hasClickedSubmit={
                    this.state.userNameIsAvailable[this.state.userNameInput] ===
                    UsernameAvailability.Unavailable
                  }
                  errorMessage={
                    this.state.userNameIsAvailable[this.state.userNameInput] ===
                    UsernameAvailability.Unavailable ? (
                      <FormattedMessage id="obpUsernameTakenInputError" />
                    ) : (
                      this.state.userNameInputError
                    )
                  }
                  successMessage={
                    this.state.userNameIsAvailable[this.state.userNameInput] ===
                    UsernameAvailability.Available ? (
                      <FormattedMessage id="obpUserNameAvailable" />
                    ) : null
                  }
                />
                <Button
                  disabled={
                    this.state.userNameInputError !== null ||
                    this.state.userNameIsAvailable[this.state.userNameInput] ===
                      UsernameAvailability.Unavailable ||
                    this.state.state === State.RegisteringUsername
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
        {this.state.state === State.RegisteringUsernameDone && (
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
      this.state.userNameIsAvailable[userNameToCheck] ===
        UsernameAvailability.Unavailable ||
      reduceValidators(this.unValidators, userNameToCheck) !== null
    ) {
      return;
    }
    this.setState(prevState => ({
      userNameIsAvailable: {
        ...prevState.userNameIsAvailable,
        [userNameToCheck]: UsernameAvailability.Loading,
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
            [userNameToCheck]: snapshot.exists
              ? UsernameAvailability.Unavailable
              : UsernameAvailability.Available,
          },
        }));
      })
      .catch(() => {
        this.setState(prevState => ({
          userNameIsAvailable: {
            ...prevState.userNameIsAvailable,
            [userNameToCheck]: UsernameAvailability.Error,
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
      state: nextState(prevState.state, Action.RegisterUsername),
    }));
    registerUsername(this.state.userNameInput)
      .then(() => {
        this.setState(prevState => ({
          state: nextState(prevState.state, Action.RegisterUsernameDone),
        }));
      })
      .catch((reason: firebase.firestore.FirestoreError) => {
        let userNameInputError: React.ReactNode;
        if (reason.code === 'already-exists') {
          userNameInputError = (
            <FormattedMessage id="obpUsernameTakenInputError" />
          );
        } else if (reason.code === 'internal' && !navigator.onLine) {
          userNameInputError = (
            <FormattedMessage id="obpUsernameSubmitOfflineError" />
          );
        } else {
          userNameInputError = (
            <FormattedMessage id="obpGenericUsernameSubmitError" />
          );
        }
        this.setState(prevState => ({
          state: nextState(prevState.state, Action.RegisterUsernameFailed),
          userNameInputError,
        }));
      });
  };
}
