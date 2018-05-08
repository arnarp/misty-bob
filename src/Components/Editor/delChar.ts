import {
  BackspaceAction,
  RootNode,
  ParagraphNode,
  TextNode,
  EditorNode,
  NodeType,
} from './model';
import { assertUnreachable } from '../../Utils/assertUnreachable';
import { isEmpty } from '../../Utils/isEmpty';

export function delChar(
  action: BackspaceAction,
  node: RootNode,
  genNodeId: () => string,
): RootNode;
export function delChar(
  action: BackspaceAction,
  node: ParagraphNode,
  genNodeId: () => string,
): ParagraphNode | undefined;
export function delChar(
  action: BackspaceAction,
  node: TextNode,
  genNodeId: () => string,
): TextNode | undefined;
export function delChar(
  action: BackspaceAction,
  node: EditorNode,
  genNodeId: () => string,
): EditorNode | undefined {
  switch (node.type) {
    case NodeType.Root: {
      const newChild = delChar(action, node.children[node.cursor], genNodeId);
      const newChildren = {
        ...node.children,
      };
      if (newChild === undefined) {
        delete newChildren[node.cursor];
      } else {
        newChildren[node.cursor] = newChild;
      }
      if (isEmpty(newChildren)) {
        return node;
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
      const childWithCursor = node.children[node.cursor];
      if (childWithCursor.type === NodeType.Dead) {
        return node; // Todo
      }
      const newChild = delChar(action, childWithCursor, genNodeId);
      const newChildren = {
        ...node.children,
      };
      if (newChild === undefined) {
        delete newChildren[node.cursor];
      } else {
        newChildren[node.cursor] = newChild;
      }
      if (isEmpty(newChildren)) {
        return undefined;
      } else {
        return {
          ...node,
          children: newChildren,
        };
      }
    }
    case NodeType.Text: {
      if (node.cursor === undefined) {
        return node;
      }
      if (node.value.length === 0) {
        return undefined;
      }
      return {
        ...node,
        value: node.value.slice(0, -1),
        cursor: Math.max(node.cursor - 1, 0),
      };
    }
    case NodeType.Dead: {
      return undefined;
    }
    default:
      return assertUnreachable(node);
  }
}
