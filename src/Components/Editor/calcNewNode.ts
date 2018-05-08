import {
  EditorAction,
  RootNode,
  ParagraphNode,
  TextNode,
  EditorNode,
  ActionType,
  NodeType,
} from './model';
import { addChar } from './addChar';
import { assertUnreachable } from '../../Utils/assertUnreachable';
import { delChar } from './delChar';

export function calcNewNode(action: EditorAction, node: RootNode): RootNode;
export function calcNewNode(
  action: EditorAction,
  node: ParagraphNode,
): ParagraphNode | undefined;
export function calcNewNode(
  action: EditorAction,
  node: TextNode,
): TextNode | undefined;
export function calcNewNode(action: EditorAction, node: EditorNode) {
  switch (action.type) {
    case ActionType.AddChar: {
      switch (node.type) {
        case NodeType.Root:
          return addChar(action, node);
        case NodeType.Paragraph:
          return addChar(action, node);
        case NodeType.Text:
          return addChar(action, node);
        default:
          return assertUnreachable(node);
      }
    }
    case ActionType.Backspace: {
      switch (node.type) {
        case NodeType.Root:
          return delChar(action, node);
        case NodeType.Paragraph:
          return delChar(action, node);
        case NodeType.Text:
          return delChar(action, node);
        default:
          return assertUnreachable(node);
      }
    }
    default:
      return assertUnreachable(action);
  }
}
