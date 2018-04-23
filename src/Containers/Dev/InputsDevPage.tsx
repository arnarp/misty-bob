import * as React from 'react';
import { Col, PageHeader } from '../../Components';
import { RadioGroup } from '../../Components/Inputs/RadioGroup';
import { Toggle } from '../../Components/Inputs/Toggle';

type InputsDevPageProps = {};

const initialState = {
  radioValue: '1',
  toggleChecked: false,
  toggleCheckedDb: false,
};
type InputsDevPageState = Readonly<typeof initialState>;

export class InputsDevPage extends React.PureComponent<
  InputsDevPageProps,
  InputsDevPageState
> {
  readonly state: InputsDevPageState = initialState;

  render() {
    return (
      <Col as="main" sidePaddings="mediumResponsive" spacing="large">
        <PageHeader>Inputs</PageHeader>
        <Col>
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
        <Col>
          <h2>Toggle</h2>
          <Toggle
            label="Label"
            checked={this.state.toggleChecked}
            onChange={value => this.setState(() => ({ toggleChecked: value }))}
          />
          <Toggle
            label="Með 1sek debounce"
            debounce
            checked={this.state.toggleCheckedDb}
            onChange={value =>
              this.setState(() => ({ toggleCheckedDb: value }))
            }
          />
        </Col>
      </Col>
    );
  }
}