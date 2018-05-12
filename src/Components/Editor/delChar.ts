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
import { getPreviousChild } from './utils';

export function delChar(action: BackspaceAction, node: RootNode): RootNode;
export function delChar(
  action: BackspaceAction,
  node: ParagraphNode,
): ParagraphNode | undefined;
export function delChar(
  action: BackspaceAction,
  node: TextNode,
): TextNode | undefined;
export function delChar(
  action: BackspaceAction,
  node: EditorNode,
): EditorNode | undefined {
  switch (node.type) {
    case NodeType.Root: {
      const newChild = delChar(action, node.children[node.cursor]);
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
        const previousChild = getPreviousChild(node.children, node.cursor);
        if (
          previousChild === undefined ||
          previousChild.type === NodeType.Dead
        ) {
          return node;
        }
        const newChildren = {
          ...node.children,
          [previousChild.id]: {
            ...previousChild,
            cursor: previousChild.value.length,
          },
        };
        delete newChildren[childWithCursor.id];
        return {
          ...node,
          cursor: previousChild.id,
          children: newChildren,
        };
      } else {
        const newChild = delChar(action, childWithCursor);
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
