import * as React from 'react';
import './Button.css';
import * as classNames from 'classnames';

type ButtonStyle = 'Raised' | 'Action' | 'Flat';

interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  lookLikeDisabled?: boolean;
  color: 'Default' | 'Primary' | 'Secondary' | 'White';
  style?: ButtonStyle;
  type?: 'button' | 'submit';
}
interface ButtonState {}
export class Button extends React.PureComponent<ButtonProps, ButtonState> {
  constructor(props: ButtonProps) {
    super(props);
  }
  render() {
    const style: ButtonStyle = this.props.style || 'Raised';
    return (
      <button
        type={this.props.type || 'button'}
        disabled={this.props.disabled}
        onClick={this.props.onClick}
        className={classNames('Button', this.props.color, `Style-${style}`, {
          Disabled: this.props.lookLikeDisabled || this.props.disabled,
        })}
      >
        {this.props.children}
      </button>
    );
  }
}
