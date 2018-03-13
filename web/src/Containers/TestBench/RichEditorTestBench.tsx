import * as React from 'react';
import {
  EditorState,
  convertToRaw,
  // RichUtils,
  // getDefaultKeyBinding,
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import { RichTextEditor } from '../../Components/Editor';
import { RichTextContent } from '../../Components/Editor/RichTextContent';

interface RichTextEditorTestBenchProps {}

const initialState = { editorState: EditorState.createEmpty() };
type RichTextEditorTestBenchState = Readonly<typeof initialState>;

export class RichTextEditorTestBench extends React.PureComponent<
  RichTextEditorTestBenchProps,
  RichTextEditorTestBenchState
> {
  readonly state: RichTextEditorTestBenchState = initialState;

  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ flexBasis: '50%' }}>
          <RichTextEditor
            editorState={this.state.editorState}
            onChange={this.onChange}
          />
        </div>
        <div style={{ flexBasis: '50%' }}>
          <RichTextContent
            content={this.state.editorState.getCurrentContent()}
          />
        </div>
      </div>
    );
  }
  private onChange = (editorState: EditorState) => {
    this.setState(() => ({ editorState }));
    // tslint:disable-next-line:no-console
    console.log(convertToRaw(editorState.getCurrentContent()));
  };
}
