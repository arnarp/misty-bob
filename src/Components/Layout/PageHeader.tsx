import * as React from 'react';
import { Row } from '.';
import './PageHeader.css';

type PageHeaderProps = {};

export const PageHeader: React.SFC<PageHeaderProps> = props => (
  <Row sidePaddings="mediumResponsive" className="PageHeader">
    <h1>{props.children}</h1>
  </Row>
);
