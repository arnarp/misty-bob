import * as React from 'react';
import './PageHeader.css';

type PageHeaderProps = {};

export const PageHeader: React.SFC<PageHeaderProps> = props => (
  <h1 className="PageHeader">{props.children}</h1>
);
