import * as React from 'react';
import * as uuid from 'uuid';
import './TextInput.css';
import * as classNames from 'classnames';
import { TextInputValidator } from './TextInputValidators';

export const reduceValidators = (
  validators: TextInputValidator[],
  textInput: string,
) =>
  validators.reduce((res: React.ReactNode, validator) => {
    if (res === null) {
      return validator(textInput);
    }
    return res;
  }, null);

type TextInputProps = {
  label: React.ReactNode;
  value: string;
  onChange: (name: string) => void;
  // validators: TextInputValidator[];
  loading?: boolean;
  errorMessage?: React.ReactNode;
  successMessage?: React.ReactNode;
  hasClickedSubmit?: boolean;
  type?: 'text' | 'email';
  size?: 'h1';
};
const initialState = {
  hasFocus: false,
  hasReceivedFocus: false,
  hasChangedInput: false,
};
type TextInputState = Readonly<typeof initialState>;
export class TextInput extends React.PureComponent<
  TextInputProps,
  TextInputState
> {
  id: string = uuid();
  readonly state: TextInputState = initialState;
  render() {
    const showErrorMessage =
      !this.props.loading &&
      this.props.errorMessage !== null &&
      (this.props.hasClickedSubmit ||
        (!this.state.hasFocus &&
          this.state.hasReceivedFocus &&
          this.state.hasChangedInput));
    const showSuccessMessage =
      !showErrorMessage &&
      !this.props.loading &&
      this.props.successMessage !== null &&
      this.props.successMessage !== undefined;
    return (
      <div
        className={classNames('TextInput', {
          Focus: this.state.hasFocus,
          NotEmpty: this.props.value !== '',
          Loading: this.props.loading,
          Error: showErrorMessage,
          Success: showSuccessMessage,
          'Size-H1': this.props.size === 'h1',
        })}
      >
        <label htmlFor={this.id}>{this.props.label}</label>
        <div>
          <input
            type={this.props.type}
            onFocus={() =>
              this.setState(() => ({ hasFocus: true, hasReceivedFocus: true }))
            }
            onBlur={() => this.setState(() => ({ hasFocus: false }))}
            value={this.props.value}
            onChange={event => {
              this.setState(() => ({ hasChangedInput: true }));
              this.props.onChange(event.target.value);
            }}
          />
        </div>
        {showErrorMessage &&
          this.props.errorMessage && (
            <p className="ErrorMessage">{this.props.errorMessage}</p>
          )}
        {showSuccessMessage && (
          <p className="SuccessMessage">{this.props.successMessage}</p>
        )}
      </div>
    );
  }
}
