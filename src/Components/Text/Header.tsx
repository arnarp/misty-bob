import * as React from 'react';
import './Styles.css';
import * as classNames from 'classnames';

type HeaderProps = {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  center?: boolean;
};

export const Header: React.SFC<HeaderProps> = props => {
  const Node = `h${props.level}`;
  return (
    <Node className={classNames('Text-Header', { Center: props.center })}>
      {props.children}
    </Node>
  );
};
