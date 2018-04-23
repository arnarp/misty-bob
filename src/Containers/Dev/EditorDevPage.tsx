import * as React from 'react';
import { EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { Row } from '../../Components';
import { RichTextEditor } from '../../Components/Editor';
import { RichTextContent } from '../../Components/Editor/RichTextContent';

interface RichTextEditorTestBenchProps {}

const initialState = { editorState: EditorState.createEmpty() };
type RichTextEditorTestBenchState = Readonly<typeof initialState>;

export class EditorDevPage extends React.PureComponent<
  RichTextEditorTestBenchProps,
  RichTextEditorTestBenchState
> {
  readonly state: RichTextEditorTestBenchState = initialState;

  render() {
    return (
      <Row as="main" sidePaddings="mediumResponsive">
        <div style={{ width: '50%' }}>
          <RichTextEditor
            editorState={this.state.editorState}
            onChange={this.onChange}
          />
        </div>
        <div style={{ width: '50%' }}>
          <RichTextContent
            content={this.state.editorState.getCurrentContent()}
          />
        </div>
      </Row>
    );
  }
  private onChange = (editorState: EditorState) => {
    this.setState(() => ({ editorState }));
  };
}
