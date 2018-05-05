import * as React from 'react';
import 'draft-js/dist/Draft.css';
import { Row } from '../../Components';
import { Editor } from '../../Components/Editor';

interface EditorTestBenchProps {}

const initialState = {};
type EditorTestBenchState = Readonly<typeof initialState>;

export class EditorDevPage extends React.PureComponent<
  EditorTestBenchProps,
  EditorTestBenchState
> {
  readonly state: EditorTestBenchState = initialState;

  render() {
    return (
      <Row as="main" sidePaddings="mediumResponsive">
        <div style={{ width: '50%' }}>
          <Editor
          // value={this.state.editorValue}
          // onChange={this.onEditorChange}
          />
        </div>
        <div style={{ width: '50%' }}>
          {/* <RichTextContent
            content={this.state.editorState.getCurrentContent()}
          /> */}
        </div>
      </Row>
    );
  }
  // private onEditorChange = () => {
  //   this.setState(() => ({ editorState }));
  // };
}
