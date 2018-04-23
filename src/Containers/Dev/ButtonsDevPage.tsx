import * as React from 'react';
import { Col, PageHeader } from '../../Components';

type ButtonsDevPageProps = {};

const initialState = {};
type ButtonsDevPageState = Readonly<typeof initialState>;

export class ButtonsDevPage extends React.PureComponent<
  ButtonsDevPageProps,
  ButtonsDevPageState
> {
  readonly state: ButtonsDevPageState = initialState;

  render() {
    return (
      <Col as="main" sidePaddings="mediumResponsive">
        <PageHeader>Dev Buttons</PageHeader>
        <h2>Button</h2>
      </Col>
    );
  }
}
