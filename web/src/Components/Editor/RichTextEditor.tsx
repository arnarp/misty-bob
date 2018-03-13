import * as React from 'react';
import {
  Editor,
  EditorState,
  ContentBlock,
  RichUtils,
  DraftEditorCommand,
  getDefaultKeyBinding,
  DraftHandleValue,
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import './RichTextContent.css';
import './RichTextEditor.css';

interface RichTextEditorProps {
  editorState: EditorState;
  onChange: (editorState: EditorState) => void;
}

const initialState = { editorState: EditorState.createEmpty() };
type RichTextEditorState = Readonly<typeof initialState>;

const getBlockStyle = (block: ContentBlock): string => {
  // tslint:disable-next-line:no-console
  console.log(block.getType());
  switch (block.getType()) {
    case 'paragraph':
    case 'unstyled':
      return 'P';
    default:
      return '';
  }
};

export class RichTextEditor extends React.PureComponent<
  RichTextEditorProps,
  RichTextEditorState
> {
  render() {
    return (
      <div className="RichText RichTextEditor">
        <Editor
          editorState={this.props.editorState}
          onChange={this.props.onChange}
          blockStyleFn={getBlockStyle}
          keyBindingFn={this.mapKeyToEditorCommand}
          handleKeyCommand={this.handleKeyCommand}
        />
      </div>
    );
  }
  private mapKeyToEditorCommand = (
    e: React.KeyboardEvent<{}>,
  ): DraftEditorCommand | string | null => {
    if (e.keyCode === 9 /* TAB */) {
      const newEditorState = RichUtils.onTab(e, this.state.editorState, 4);
      if (newEditorState !== this.state.editorState) {
        this.props.onChange(newEditorState);
      }
      return null;
    }
    return getDefaultKeyBinding(e);
  };
  private handleKeyCommand = (
    command: DraftEditorCommand | string,
    editorState: EditorState,
  ): DraftHandleValue => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.props.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  };
}
