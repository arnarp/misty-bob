import {
  AddCharAction,
  RootNode,
  ParagraphNode,
  TextNode,
  NodeType,
  EditorNode,
} from './model';
import { assertUnreachable } from '../../Utils/assertUnreachable';

export function addChar(
  action: AddCharAction,
  node: RootNode,
  genNodeId: () => string,
): RootNode;
export function addChar(
  action: AddCharAction,
  node: ParagraphNode,
  genNodeId: () => string,
): ParagraphNode;
export function addChar(
  action: AddCharAction,
  node: TextNode,
  genNodeId: () => string,
): TextNode;
export function addChar(
  action: AddCharAction,
  node: EditorNode,
  genNodeId: () => string,
): EditorNode | undefined {
  switch (node.type) {
    case NodeType.Root: {
      const newChild = addChar(action, node.children[node.cursor], genNodeId);
      const newChildren = {
        ...node.children,
      };
      if (newChild === undefined) {
        delete newChildren[node.cursor];
      } else {
        newChildren[node.cursor] = newChild;
      }
      return {
        ...node,
        children: newChildren,
      };
    }
    case NodeType.Paragraph: {
      if (node.cursor === undefined) {
        return node;
      }
      const cursorChild = node.children[node.cursor];
      if (cursorChild.type === NodeType.Dead) {
        // todo
        return node;
      }
      const newChild = addChar(action, cursorChild, genNodeId);
      const newChildren = {
        ...node.children,
      };
      if (newChild === undefined) {
        delete newChildren[node.cursor];
      } else {
        newChildren[node.cursor] = newChild;
      }
      return {
        ...node,
        children: newChildren,
      };
    }
    case NodeType.Text: {
      if (node.cursor === undefined) {
        return node;
      }
      return {
        ...node,
        value: node.value + action.char,
        cursor: node.cursor + 1,
      };
    }
    case NodeType.Dead:
      return undefined;
    default:
      return assertUnreachable(node);
  }
}
