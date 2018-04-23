import * as React from 'react';
import { Col, PageHeader } from '../../Components';
import { RadioGroup } from '../../Components/Inputs/RadioGroup';

type InputsDevPageProps = {};

const initialState = {
  radioValue: '1',
};
type InputsDevPageState = Readonly<typeof initialState>;

export class InputsDevPage extends React.PureComponent<
  InputsDevPageProps,
  InputsDevPageState
> {
  readonly state: InputsDevPageState = initialState;

  render() {
    return (
      <Col as="main" sidePaddings="mediumResponsive">
        <PageHeader>Dev Inputs</PageHeader>
        <h2>Radio group</h2>
        <RadioGroup
          legend="Legend"
          options={[
            { label: 'Val blah 1', value: '1' },
            { label: 'Val 2', value: '2' },
            { label: 'Val 3', value: '3' },
          ]}
          value={this.state.radioValue}
          onChange={value => this.setState(() => ({ radioValue: value }))}
        />
      </Col>
    );
  }
}
