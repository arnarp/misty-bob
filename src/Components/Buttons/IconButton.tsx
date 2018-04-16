import * as React from 'react';
import './IconButton.css';
import { IconProps, MainColors } from '../Icons/IconProps';
import * as classNames from 'classnames';

type IconButtonProps = {
  Icon: (props: IconProps) => JSX.Element;
  onClick?: () => void;
  color: MainColors;
  disabled?: boolean;
  label: string;
};
export class IconButton extends React.PureComponent<IconButtonProps> {
  button: HTMLButtonElement | null;
  focus() {
    if (this.button) {
      this.button.focus();
    }
  }
  render() {
    return (
      <button
        ref={ref => {
          this.button = ref;
        }}
        type="button"
        disabled={this.props.disabled}
        aria-label={this.props.label}
        onClick={this.props.onClick}
        className={classNames('IconButton', `Color-${this.props.color}`)}
      >
        <this.props.Icon
          size="medium"
          color={this.props.disabled ? 'default' : this.props.color}
        />
        {this.props.children}
      </button>
    );
  }
}
