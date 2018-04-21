import * as React from 'react';
import { RichTextEditorTestBench } from './RichEditorTestBench';
import { Switch, Route } from 'react-router-dom';
import { TestBenchIndexPage } from './TestBenchIndexPage';

type TestBenchProps = {};

export const TestBench: React.SFC<TestBenchProps> = props => (
  <Switch>
    <Route path="/test" exact component={TestBenchIndexPage} />
    <Route path="/test/editor" component={RichTextEditorTestBench} />
  </Switch>
);
