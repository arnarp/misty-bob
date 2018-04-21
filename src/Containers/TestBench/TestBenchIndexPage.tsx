import * as React from 'react';
import { Col } from '../../Components';
import { Link } from 'react-router-dom';

type TestBenchIndexPageProps = {};

export const TestBenchIndexPage: React.SFC<TestBenchIndexPageProps> = props => (
  <Col as="main">
    <h1>Component Dev</h1>
    <Link to="/test/editor">Editor</Link>
  </Col>
);
