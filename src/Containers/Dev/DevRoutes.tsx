import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import { DevIndexPage } from './DevIndexPage';
import { EditorDevPage } from './EditorDevPage';
import { RichTextEditorDevPage } from './RichTextEditorDevPage';
import { ButtonsDevPage } from './ButtonsDevPage';
import { InputsDevPage } from './InputsDevPage';

type DevProps = {};

export const DevRoutes: React.SFC<DevProps> = props => (
  <Switch>
    <Route path="/dev" exact component={DevIndexPage} />
    <Route path="/dev/editor" component={EditorDevPage} />
    <Route path="/dev/richTextEditor" component={RichTextEditorDevPage} />
    <Route path="/dev/buttons" component={ButtonsDevPage} />
    <Route path="/dev/inputs" component={InputsDevPage} />
  </Switch>
);
