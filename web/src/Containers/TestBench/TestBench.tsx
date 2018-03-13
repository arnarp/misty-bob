import * as React from 'react';
import { RichTextEditorTestBench } from './RichEditorTestBench';

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
        <RichTextEditorTestBench />
      </main>
    );
  }
}
