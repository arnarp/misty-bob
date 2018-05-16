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
  NodeId,
} from './model';
import { assertUnreachable } from '../../Utils/assertUnreachable';
import { calcNewTree } from './calcNewTree';
import { getRawText, getMobileOperatingSystem } from './utils';
import * as classNames from 'classnames';
declare global {
  interface Event {
    inputType?: string;
    data?: string;
    isComposing?: boolean;
  }
}
const isMobile = getMobileOperatingSystem() !== undefined;

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
  cursorRef = React.createRef<HTMLParagraphElement>();
  textareaRef = React.createRef<HTMLTextAreaElement>();

  render() {
    console.log('render', this.state);
    return (
      <div
        className="Editor"
        role="textbox"
        onClick={event => {
          console.log('onClick', { ...event });
          if (this.textareaRef.current) {
            this.textareaRef.current.focus();
          }
        }}
      >
        <textarea
          ref={this.textareaRef}
          value={getRawText(this.state.root)}
          onKeyDown={this.onKeyDown}
          onChange={this.onChange}
          onFocus={() => {
            this.setState(() => ({ hasFocus: true }));
          }}
          onBlur={() => {
            this.setState(() => ({ hasFocus: false }));
          }}
          onPaste={event => {
            console.log('onPaste', { ...event });
            event.clipboardData.items[0].getAsString((text: string) => {
              console.log('onPaste text', {
                text,
                val: text.replace(String.fromCharCode(10), ' '),
              });
              this.setState(prevState => ({
                root: calcNewTree(
                  {
                    type: ActionType.InsertText,
                    text: text.replace(String.fromCharCode(10), ' '),
                    composing: false,
                  },
                  prevState.root,
                )!,
              }));
            });
          }}
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
          <p
            key={n.id}
            ref={this.cursorRef}
            onClick={event => {
              event.stopPropagation();
              event.preventDefault();
              const collection = event.currentTarget.getElementsByClassName(
                'Char',
              );
              if (collection.length === 0) {
                // Should not happen. All paragraphs should have at least " ".
                return;
              }
              let closestElement = collection.item(0);
              let closestElementDist = Number.MAX_VALUE;
              for (let i = 0; i < collection.length; i++) {
                const element = collection.item(i);
                const rect = element.getBoundingClientRect();
                const dist = Math.sqrt(
                  Math.pow(rect.left - event.clientX, 2) +
                    Math.pow(rect.top + rect.height / 2 - event.clientY, 2),
                );
                if (dist < closestElementDist) {
                  closestElement = element;
                  closestElementDist = dist;
                }
              }
              const [nodeId, cursor] = closestElement.id.split('_');
              this.setCursorOnLeafNode(nodeId, Number(cursor));
            }}
          >
            {Object.values(n.children).map(this.renderNode)}
          </p>
        );
      case NodeType.Text:
      case NodeType.Dead:
        return (
          <span
            className={classNames({
              Dead: n.type === NodeType.Dead,
            })}
            key={n.id}
          >
            {Array.from(Array(n.value.length + 1).keys()).map(index => {
              const char = n.value.charAt(index);
              const hasBlinkingCursor =
                n.cursor === index && this.state.hasFocus;
              return (
                <span
                  id={`${n.id}_${index}`}
                  className={classNames('Char', {
                    Cursor: hasBlinkingCursor,
                  })}
                  key={`${n.id}_${index}`}
                >
                  {char || (index === 0 ? ' ' : char)}
                  {hasBlinkingCursor && <span key={new Date().toISOString()} />}
                </span>
              );
            })}
          </span>
        );
      default:
        assertUnreachable(n);
    }
  };

  private setCursorOnLeafNode = (nodeId: NodeId, cursorPos: number) => {
    if (
      this.textareaRef.current &&
      this.textareaRef.current !== document.activeElement
    ) {
      this.textareaRef.current.focus();
    }
    this.setState(prevState => ({
      hasFocus: true,
      root: calcNewTree(
        { type: ActionType.SetCursor, nodeId, pos: cursorPos },
        prevState.root,
        uuid,
      ),
    }));
  };

  private onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('onChange', { ...event });
    let action: EditorAction | undefined = undefined;
    if (!isMobile) {
      return;
    }
    if (
      event.nativeEvent.inputType === 'insertText' &&
      event.nativeEvent.data
    ) {
      action = {
        type: ActionType.InsertText,
        text: event.nativeEvent.data,
        composing: false,
      };
    }
    if (
      event.nativeEvent.inputType === 'deleteContentBackward' &&
      event.nativeEvent.isComposing === false
    ) {
      action = {
        type: ActionType.Backspace,
      };
    }
    if (
      event.nativeEvent.inputType === 'insertCompositionText' &&
      event.nativeEvent.isComposing &&
      event.nativeEvent.data
    ) {
      action = {
        type: ActionType.InsertText,
        text: event.nativeEvent.data,
        composing: true,
      };
    }
    if (action !== undefined) {
      console.log('OnChange -> Action', action);
      this.setState(prevState => ({
        root: calcNewTree(action!, prevState.root, uuid),
      }));
    }
  };

  private onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    console.log('onKeyDown', { ...event }, event.key, event.nativeEvent.code);
    let action: EditorAction | undefined = undefined;
    type EventKey =
      | 'Key'
      | 'Backspace'
      | 'Dead'
      | 'ArrowLeft'
      | 'ArrowRight'
      | 'Enter';
    const eventKey: EventKey =
      event.key.length === 1 ? 'Key' : (event.key as EventKey);
    switch (eventKey) {
      case 'Key':
        if (!event.metaKey && !event.ctrlKey) {
          action = {
            type: ActionType.InsertText,
            text: event.key,
            composing: false,
          };
        }
        break;
      case 'Backspace':
        action = {
          type: ActionType.Backspace,
        };
        break;
      case 'Dead':
        action = {
          type: ActionType.Dead,
        };
        break;
      case 'ArrowLeft':
        action = {
          type: ActionType.MoveCursor,
          value: -1,
        };
        break;
      case 'ArrowRight':
        action = {
          type: ActionType.MoveCursor,
          value: 1,
        };
        break;
      case 'Enter':
        action = {
          type: ActionType.Enter,
        };
        break;
      default:
        break;
    }

    if (action !== undefined) {
      event.preventDefault();
      event.stopPropagation();
      console.log('Keydown -> Action', action);
      this.setState(prevState => ({
        root: calcNewTree(action!, prevState.root, uuid)!,
      }));
    }
  };
}
