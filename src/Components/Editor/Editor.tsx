import * as React from 'react';
import * as uuid from 'uuid';
import './Editor.css';

export const enum ActionType {
  AddChar = 'A',
}

export type AddCharAction = {
  type: ActionType.AddChar;
  char: string;
};

export type EditorAction = AddCharAction;

export const enum NodeType {
  Root = 'R',
  Paragraph = 'P',
}
export type NodeId = string;
export type EditorNode = Readonly<{
  id: NodeId;
  type: NodeType;
  cursor: boolean | NodeId;
  value?: string;
  children?: { [id: string]: EditorNode };
}>;

const createNode: (
  config: {
    type: NodeType;
    cursor: boolean | NodeId;
    children?: { [id: string]: EditorNode };
  },
) => EditorNode = ({ type, cursor, children }) => ({
  id: uuid(),
  type,
  cursor,
  children,
});
const p = createNode({ type: NodeType.Paragraph, cursor: true });
const root = createNode({
  type: NodeType.Root,
  children: { [p.id]: p },
  cursor: p.id,
});

export function calcNewNode(
  action: EditorAction,
  node: EditorNode,
): EditorNode {
  if (node.cursor === true) {
    return {
      ...node,
      value: node.value === undefined ? action.char : node.value + action.char,
    };
  }
  if (typeof node.cursor === 'string' && node.children) {
    const newNode: EditorNode = {
      ...node,
      children: {
        ...node.children,
        [node.cursor]: calcNewNode(action, node.children[node.cursor]),
      },
    };
    return newNode;
  }
  return node;
}

type EditorProps = {
  readOnly?: boolean;
};
const initialState = {
  root: root,
};
type EditorState = Readonly<typeof initialState>;

export class Editor extends React.PureComponent<EditorProps, EditorState> {
  readonly state: EditorState = initialState;
  editorRef = React.createRef<HTMLDivElement>();

  render() {
    console.log('render', this.state.root);
    return (
      <div
        ref={this.editorRef}
        tabIndex={1}
        className="Editor"
        // contentEditable={!this.props.readOnly}
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
          // if (this.state.root.children && this.state.root.)
        }}
      >
        {this.state.root.children &&
          Object.values(this.state.root.children).map(this.renderNode)}
      </div>
    );
  }
  private renderNode = (n: EditorNode) => <p key={n.id}>{n.value}</p>;

  private onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    console.log('onKeyDown', { ...event }, event.key, event.nativeEvent.code);
    if (event.key.length === 1 && !event.metaKey && !event.ctrlKey) {
      const action: AddCharAction = {
        type: ActionType.AddChar,
        char: event.key,
      };
      this.setState(prevState => ({
        root: calcNewNode(action, prevState.root),
      }));
    } else {
      event.preventDefault();
    }
  };
}
