import * as React from 'react';
import { Button } from '../../Components/Buttons';

interface TestBenchProps {}
interface TestBenchState {}
export class TestBench extends React.PureComponent<
  TestBenchProps,
  TestBenchState
> {
  constructor(props: TestBenchProps) {
    super(props);
  }
  render() {
    return (
      <main>
        <Button color="Default">Test</Button>
      </main>
    );
  }
}
