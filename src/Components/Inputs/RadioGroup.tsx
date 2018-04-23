import * as React from 'react';
import { Col } from '../../Components';
import './RadioGroup.css';
import { Radio } from './Radio';

interface RadioGroupProps<T> {
  legend: string;
  options: Array<{ label: string; value: T }>;
  value: T;
  onChange: (value: T) => void;
}
interface RadioGroupState {}
export class RadioGroup<T extends string> extends React.PureComponent<
  RadioGroupProps<T>,
  RadioGroupState
> {
  constructor(props: RadioGroupProps<T>) {
    super(props);
  }
  render() {
    const RadioOfT = Radio as { new (): Radio<T> };
    return (
      <Col as="fieldset" className="RadioGroupFieldSet" spacing="small">
        <legend>{this.props.legend}</legend>
        <Col role="radiogroup" aria-label={this.props.legend}>
          {this.props.options.map(o => (
            <RadioOfT
              key={o.value}
              label={o.label}
              value={o.value}
              checked={o.value === this.props.value}
              onChange={this.props.onChange}
            />
          ))}
        </Col>
      </Col>
    );
  }
}
