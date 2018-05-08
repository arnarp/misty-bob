import * as React from 'react';
import * as uuid from 'uuid';
import './Editor.css';
import {
  RootNode,
  NodeType,
  EditorNode,
  EditorAction,
  ActionType,
  ParagraphNode,
  TextNode,
} from './model';
import { assertUnreachable } from '../../Utils/assertUnreachable';
import { calcNewTree } from './calcNewTree';

const t: TextNode = {
  id: uuid(),
  type: NodeType.Text,
  cursor: 0,
  value: '',
};
const p: ParagraphNode = {
  id: uuid(),
  type: NodeType.Paragraph,
  cursor: t.id,
  children: { [t.id]: t },
};
const root: RootNode = {
  id: uuid(),
  type: NodeType.Root,
  cursor: p.id,
  children: { [p.id]: p },
};

type EditorProps = {
  readOnly?: boolean;
};
const initialState = {
  root: root,
  hasFocus: false,
};
type EditorState = Readonly<typeof initialState>;

export class Editor extends React.PureComponent<EditorProps, EditorState> {
  readonly state: EditorState = initialState;
  editorRef = React.createRef<HTMLDivElement>();
  cursorRef = React.createRef<HTMLParagraphElement>();

  componentDidUpdate() {
    if (this.state.hasFocus && this.cursorRef.current) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.setStartAfter(this.cursorRef.current);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  render() {
    console.log('render', this.state.root, window.getSelection());
    return (
      <div
        ref={this.editorRef}
        tabIndex={1}
        className="Editor"
        contentEditable={!this.props.readOnly}
        suppressContentEditableWarning
        role="textbox"
        onInput={event => {
          console.log('onInput', { ...event });
        }}
        onKeyDown={this.onKeyDown}
        onPaste={event => {
          console.log('onPaste', { ...event });
        }}
        onPasteCapture={event => {
          console.log('onPastCapture', { ...event });
        }}
        onFocus={() => {
          this.setState(() => ({ hasFocus: true }));
          // if (this.state.root.children && this.state.root.)
        }}
        onBlur={() => {
          this.setState(() => ({ hasFocus: false }));
        }}
      >
        {this.renderNode(this.state.root)}
      </div>
    );
  }
  private renderNode = (n: EditorNode) => {
    switch (n.type) {
      case NodeType.Root:
        return Object.values(n.children).map(this.renderNode);
      case NodeType.Paragraph:
        return (
          <p key={n.id} ref={this.cursorRef}>
            {Object.values(n.children).map(this.renderNode)}
          </p>
        );
      case NodeType.Text:
        return <span key={n.id}>{n.value}</span>;
      case NodeType.Dead:
        return (
          <span key={n.id} className="Dead">
            {n.value}
          </span>
        );
      default:
        assertUnreachable(n);
    }
  };

  private onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    console.log('onKeyDown', { ...event }, event.key, event.nativeEvent.code);
    let action: EditorAction | undefined = undefined;
    if (event.key.length === 1 && !event.metaKey && !event.ctrlKey) {
      action = {
        type: ActionType.AddChar,
        char: event.key,
      };
    } else if (event.key === 'Backspace') {
      action = {
        type: ActionType.Backspace,
      };
    } else if (event.key === 'Dead') {
      action = {
        type: ActionType.Dead,
      };
    }

    if (action !== undefined) {
      this.setState(prevState => ({
        root: calcNewTree(action!, prevState.root, uuid)!,
      }));
    }
  };
}
