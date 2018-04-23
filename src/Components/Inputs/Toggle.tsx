import * as React from 'react';
import { debounce } from 'ts-debounce';
import { Row, Center } from '..';
import './Toggle.css';
import { Input } from './Input';
import * as classNames from 'classnames';

type ToggleProps = {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  debounce?: boolean;
};

const initialState = {
  focus: false,
};
type ToggleState = Readonly<typeof initialState>;

export class Toggle extends React.PureComponent<ToggleProps, ToggleState> {
  debouncedOnChange: () => void;
  readonly state: ToggleState = initialState;
  constructor(props: ToggleProps) {
    super(props);
    this.debouncedOnChange = debounce(this.onChange, 1000, {
      isImmediate: true,
    });
  }
  render() {
    return (
      <Row
        className={classNames('Toggle', { Checked: this.props.checked })}
        as="label"
        alignItems="center"
        justifyContent="spaceBetween"
      >
        <span>{this.props.label}</span>
        <Center className="InputContainer">
          <div className="InputBackground" />
          <div className="InputCircle" />
          <Input
            absoluteHidden
            type="checkbox"
            checked={this.props.checked}
            onChange={
              this.props.debounce ? this.debouncedOnChange : this.onChange
            }
            onFocus={() => this.setState(() => ({ focus: true }))}
            onBlur={() => this.setState(() => ({ focus: false }))}
          />
        </Center>
      </Row>
    );
  }
  private onChange = () => this.props.onChange(!this.props.checked);
}
