import * as React from 'react';
import './Styles.css';

type SecondaryProps = {};

export const Secondary: React.SFC<SecondaryProps> = props => (
  <span className="Text-Secondary">{props.children}</span>
);
