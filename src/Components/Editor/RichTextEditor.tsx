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
import { EditorControls } from './EditorControls';
import { Block } from 'src/types/Block';

interface RichTextEditorProps {
  editorState: EditorState;
  onChange: (editorState: EditorState) => void;
  editorControls?: Block[];
}

const initialState = {};
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
        {this.props.editorControls && (
          <EditorControls
            onChange={this.props.onChange}
            editorState={this.props.editorState}
            blocks={this.props.editorControls}
          />
        )}
        <Editor
          editorState={this.props.editorState}
          onChange={this.props.onChange}
          blockStyleFn={getBlockStyle}
          keyBindingFn={this.keyBindingFn}
          handleKeyCommand={this.handleKeyCommand}
          onTab={this.onTab}
        />
      </div>
    );
  }
  private onTab = (e: React.KeyboardEvent<{}>): void => {
    const newEditorState = RichUtils.onTab(
      e,
      this.props.editorState,
      4 /* maxDepth */,
    );
    if (newEditorState !== this.props.editorState) {
      this.props.onChange(newEditorState);
    }
  };
  private keyBindingFn = (
    e: React.KeyboardEvent<{}>,
  ): DraftEditorCommand | string | null => {
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
