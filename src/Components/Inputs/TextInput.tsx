import * as React from 'react';
import * as uuid from 'uuid';
import './TextInput.css';
import * as classNames from 'classnames';
import { TextInputValidator } from './TextInputValidators';

type TextInputProps = {
  label: string;
  value: string;
  onChange: (name: string) => void;
  validators: TextInputValidator[];
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
    const errorMsg = this.props.validators.reduce(
      (res: React.ReactNode, validator) => {
        if (res === null) {
          return validator(this.props.value);
        }
        return res;
      },
      null,
    );
    const showErrorMessage: boolean | null | undefined =
      errorMsg !== null &&
      (this.props.hasClickedSubmit ||
        (!this.state.hasFocus &&
          this.state.hasReceivedFocus &&
          this.state.hasChangedInput));

    return (
      <div
        className={classNames('TextInput', {
          Focus: this.state.hasFocus,
          NotEmpty: this.props.value !== '',
          Error: showErrorMessage,
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
          errorMsg && <p className="ErrorMessage">{errorMsg}</p>}
      </div>
    );
  }
}
