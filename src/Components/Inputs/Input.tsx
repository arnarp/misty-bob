import * as React from 'react';
import * as classNames from 'classnames';
import './Input.css';

type InputProps = {
  type: 'radio' | 'checkbox';
  checked?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onBlur: () => void;
  tabIndex?: 0 | -1;
  value?: string;
  absoluteHidden?: boolean;
  disabled?: boolean;
};

export const Input: React.SFC<InputProps> = props => {
  const { absoluteHidden, children, ...restOfProps } = props;
  return (
    <input
      className={classNames('Input', {
        AbsoluteHidden: absoluteHidden,
      })}
      {...restOfProps}
    >
      {children}
    </input>
  );
};
