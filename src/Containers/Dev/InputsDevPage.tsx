import * as React from 'react';
import { Col } from '../../Components';
import { RadioGroup } from '../../Components/Inputs/RadioGroup';
import { Toggle } from '../../Components/Inputs/Toggle';
import { TextInput, reduceValidators } from '../../Components/Inputs';
import {
  RequiredTextInputValidator,
  MinLengthTextInputValidator,
} from '../../Components/Inputs/TextInputValidators';

type InputsDevPageProps = {};

const initialState = {
  radioValue: '1',
  toggleChecked: false,
  toggleCheckedDb: false,
  textInputValue: '',
  textInputWithErr: '',
  textInputWithSuccess: '',
  textInputLoading: '',
};
type InputsDevPageState = Readonly<typeof initialState>;

export class InputsDevPage extends React.PureComponent<
  InputsDevPageProps,
  InputsDevPageState
> {
  readonly state: InputsDevPageState = initialState;
  readonly textInputValidator = [
    RequiredTextInputValidator,
    MinLengthTextInputValidator(2),
  ];
  render() {
    const textInputError = reduceValidators(
      this.textInputValidator,
      this.state.textInputValue,
    );
    return (
      <Col as="main" sidePaddings="mediumResponsive" spacing="large">
        <h1>Inputs</h1>
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
          <RadioGroup
            legend="Disabled"
            options={[
              { label: 'Val blah 1', value: '1' },
              { label: 'Val 2', value: '2' },
              { label: 'Val 3', value: '3' },
            ]}
            disabled
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
        <Col>
          <h2>Text</h2>
          <TextInput
            label="Text input label"
            value={this.state.textInputValue}
            onChange={value => this.setState(() => ({ textInputValue: value }))}
            errorMessage={textInputError}
          />
          <TextInput
            label="Input með error"
            value={this.state.textInputWithErr}
            onChange={value =>
              this.setState(() => ({ textInputWithErr: value }))
            }
            hasClickedSubmit={true}
            errorMessage="Villuskilaboð forcað til að sýna villuboð strax"
          />
          <TextInput
            label="Text input with success msg"
            value={this.state.textInputWithSuccess}
            onChange={value =>
              this.setState(() => ({ textInputWithSuccess: value }))
            }
            successMessage="Success message"
          />
          <TextInput
            label="Loading text input"
            value={this.state.textInputLoading}
            loading
            onChange={value =>
              this.setState(() => ({ textInputLoading: value }))
            }
            successMessage="Success message"
          />
        </Col>
      </Col>
    );
  }
}
