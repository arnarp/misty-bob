import * as React from 'react';
import { Col, PageHeader } from '../../Components';
import { Link } from 'react-router-dom';

type DevIndexPage = {};

export const DevIndexPage: React.SFC<DevIndexPage> = props => (
  <Col as="main" sidePaddings="mediumResponsive">
    <PageHeader>Dev Index</PageHeader>
    <Link to="/dev/editor">Editor</Link>
    <Link to="/dev/buttons">Buttons</Link>
    <Link to="/dev/inputs">Inputs</Link>
  </Col>
);
