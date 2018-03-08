import * as React from 'react';
import { Editor, EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css';

interface MyEditorProps {}

const initialState = { editorState: EditorState.createEmpty() };
type MyEditorState = Readonly<typeof initialState>;

export class MyEditor extends React.PureComponent<
  MyEditorProps,
  MyEditorState
> {
  readonly state: MyEditorState = initialState;

  render() {
    return (
      <Editor editorState={this.state.editorState} onChange={this.onChange} />
    );
  }
  private onChange = (editorState: EditorState) =>
    this.setState(() => ({ editorState }));
}
