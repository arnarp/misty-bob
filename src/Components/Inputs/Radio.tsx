import * as React from 'react';
import * as classNames from 'classnames';
import { Row, Center } from '..';
import { Input } from './Input';

interface RadioProps<T> {
  label: string;
  value: T;
  checked: boolean;
  disabled?: boolean;
  onChange: (value: T) => void;
}
interface RadioState {
  focus: boolean;
}
export class Radio<T extends string> extends React.PureComponent<
  RadioProps<T>,
  RadioState
> {
  constructor(props: RadioProps<T>) {
    super(props);
    this.state = { focus: false };
  }
  render() {
    return (
      <Row
        as="label"
        className={classNames('Radio', {
          Disabled: this.props.disabled,
        })}
        alignItems="center"
        justifyContent="spaceBetween"
      >
        <span>{this.props.label}</span>
        <Center
          as="span"
          className={classNames('RadioSpan', {
            Checked: this.props.checked,
            Focus: this.state.focus,
          })}
        >
          <Input
            disabled={this.props.disabled}
            absoluteHidden
            type="radio"
            value={this.props.value}
            checked={this.props.checked}
            onChange={ev => this.props.onChange(this.props.value)}
            onFocus={() => this.setState(() => ({ focus: true }))}
            onBlur={() => this.setState(() => ({ focus: false }))}
            tabIndex={this.props.checked ? 0 : -1}
          />
          {this.props.checked && (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
            </svg>
          )}
          {!this.props.checked && (
            <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
            </svg>
          )}
        </Center>
      </Row>
    );
  }
}
