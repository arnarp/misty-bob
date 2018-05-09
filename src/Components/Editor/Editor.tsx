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
import { getRawText } from './utils';
declare global {
  interface Event {
    inputType?: string;
    data?: string;
    isComposing?: boolean;
  }
}

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
  // rerender: false,
  // lastAction: undefined as undefined | EditorAction,
};
type EditorState = Readonly<typeof initialState>;

export class Editor extends React.PureComponent<EditorProps, EditorState> {
  readonly state: EditorState = initialState;
  editorRef = React.createRef<HTMLDivElement>();
  cursorRef = React.createRef<HTMLParagraphElement>();

  componentDidUpdate(prevProps: EditorProps, prevState: EditorState) {
    // if (this.state.hasFocus && this.cursorRef.current) {
    //   const selection = window.getSelection();
    //   const range = document.createRange();
    //   range.setStartAfter(this.cursorRef.current);
    //   range.collapse(true);
    //   selection.removeAllRanges();
    //   selection.addRange(range);
    // }
    // if (this.state.rerender) {
    //   console.log('forceupdate');
    //   // this.forceUpdate();
    //   this.setState(() => ({
    //     rerender: false,
    //   }));
    // }
    // if (
    //   this.editorRef.current &&
    //   this.state.lastAction &&
    //   this.state.lastAction.type === ActionType.Dead
    // ) {
    //   console.log(this.editorRef.current);
    //   const deadElements = this.editorRef.current.getElementsByClassName(
    //     'Dead',
    //   );
    //   console.log(deadElements);
    //   if (deadElements.length === 1) {
    //     deadElements[0].innerHTML = deadElements[0].innerHTML.slice(0, -1);
    //   }
    // }
    // if (
    //   this.editorRef.current &&
    //   prevState.lastAction &&
    //   prevState.lastAction.type === ActionType.Dead &&
    //   this.state.lastAction &&
    //   this.state.lastAction.type === ActionType.AddChar
    // ) {
    //   const cursorElements = this.editorRef.current.getElementsByClassName(
    //     'Cursor',
    //   );
    //   if (cursorElements.length === 1) {
    //     console.log(
    //       cursorElements[0].innerHTML,
    //       cursorElements[0].innerHTML.slice(0, -1),
    //     );
    //     console.log(
    //       'setting cursor value',
    //       getCursorNodeValue(this.state.root),
    //     );
    //     cursorElements[0].innerHTML = getCursorNodeValue(this.state.root) || '';
    //   }
    // }
  }

  // getSnapshotBeforeUpdate() {
  //   if (this.editorRef.current) {
  //     this.editorRef.current.innerHTML = '';
  //   }
  //   return null;
  // }

  render() {
    console.log('render', this.state);
    return (
      <div
        ref={this.editorRef}
        tabIndex={1}
        className="Editor"
        // contentEditable={!this.props.readOnly}
        suppressContentEditableWarning
        role="textbox"
        onInput={event => {}}
        // onKeyDown={this.onKeyDown}
        // onKeyDown={this.onKeyDown}
        onKeyPress={() => console.log('onKeyPress')}
        // onKeyUp={this.onKeyUp}
        onChange={event => console.log('onChange', { ...event })}
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
        <textarea
          value={getRawText(this.state.root)}
          onKeyDown={this.onKeyDown}
          onChange={this.onChange}
        />
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
        return (
          <span className={n.cursor === undefined ? '' : 'Cursor'} key={n.id}>
            {n.value}
          </span>
        );
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

  private onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('onChange', { ...event });
    let action: EditorAction | undefined = undefined;
    if (
      event.nativeEvent.inputType === 'insertText' &&
      event.nativeEvent.data &&
      event.nativeEvent.isComposing !== undefined
    ) {
      action = {
        type: ActionType.AddChar,
        char: event.nativeEvent.data,
      };
    }
    if (action !== undefined) {
      this.setState(prevState => ({
        root: calcNewTree(action!, prevState.root, uuid),
      }));
    }
  };

  private onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    event.stopPropagation();
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
      console.log('Action', action);
      this.setState(prevState => ({
        root: calcNewTree(action!, prevState.root, uuid)!,
        // lastAction: action,
        // rerender: action!.type === ActionType.Dead,
        //   prevState.lastAction !== undefined &&
        //   prevState.lastAction.type === ActionType.Dead &&
        //   action!.type === ActionType.AddChar,
      }));
    }
  };
  // private onKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
  //   event.preventDefault();
  //   event.stopPropagation();
  //   console.log('onKeyUp', { ...event }, event.key, event.nativeEvent.code);
  //   let action: EditorAction | undefined = undefined;
  //   if (event.key.length === 1 && !event.metaKey && !event.ctrlKey) {
  //     action = {
  //       type: ActionType.AddChar,
  //       char: event.key,
  //     };
  //   } else if (event.key === 'Backspace') {
  //     action = {
  //       type: ActionType.Backspace,
  //     };
  //   } else if (event.key === 'Dead') {
  //     action = {
  //       type: ActionType.Dead,
  //     };
  //   }

  //   if (action !== undefined) {
  //     this.setState(prevState => ({
  //       root: calcNewTree(action!, prevState.root, uuid)!,
  //       lastAction: action,
  //       // rerender: action!.type === ActionType.Dead,
  //       //   prevState.lastAction !== undefined &&
  //       //   prevState.lastAction.type === ActionType.Dead &&
  //       //   action!.type === ActionType.AddChar,
  //     }));
  //   }
  // };
}
