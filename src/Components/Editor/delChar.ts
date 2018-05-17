import {
  BackspaceAction,
  RootNode,
  TextNode,
  EditorNode,
  NodeType,
  ActionType,
  BlockNode,
} from './model';
import { assertUnreachable } from '../../Utils/assertUnreachable';
import { isEmpty } from '../../Utils/isEmpty';
import { getPreviousChild, createCursor } from './utils';
import { setCursor } from './setCursor';

export function delChar(action: BackspaceAction, node: RootNode): RootNode;
export function delChar(
  action: BackspaceAction,
  node: BlockNode,
): BlockNode | undefined;
export function delChar(
  action: BackspaceAction,
  node: TextNode,
): TextNode | undefined;
export function delChar(
  action: BackspaceAction,
  node: EditorNode,
): EditorNode | undefined {
  if (node.cursor === undefined) {
    return node;
  }
  switch (node.type) {
    case NodeType.Root: {
      const newChild = delChar(action, node.children[node.cursor]);
      const previousChild = getPreviousChild(node.children, node.cursor);
      if (newChild === undefined && previousChild === undefined) {
        return node;
      }
      const newChildren = {
        ...node.children,
      };
      const newRoot = {
        ...node,
        children: newChildren,
      };
      if (newChild === undefined) {
        delete newChildren[node.cursor];
        if (previousChild !== undefined) {
          newRoot.cursor = previousChild.id;
          const previousChildChildrens = Object.values(previousChild.children);
          const previousChildLastChild =
            previousChildChildrens[previousChildChildrens.length - 1];
          newRoot.children[newRoot.cursor] = setCursor(
            {
              type: ActionType.SetCursor,
              nodeId: previousChildLastChild.id,
              pos: previousChildLastChild.value.length,
            },
            previousChild,
          );
        }
      } else {
        newChildren[node.cursor] = newChild;
      }

      return newRoot;
    }
    case NodeType.Header:
    case NodeType.Paragraph: {
      const childWithCursor = node.children[node.cursor];
      if (childWithCursor.type === NodeType.Dead) {
        return node;
      }
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
    case NodeType.Text: {
      if (node.value.length === 0) {
        return undefined;
      }
      const newCursor = createCursor(Math.max(node.cursor.to - 1, 0));
      return {
        ...node,
        value:
          node.value.slice(0, newCursor.to) +
          node.value.slice(newCursor.to + 1),
        cursor: newCursor,
      };
    }
    case NodeType.Dead: {
      return node;
    }
    default:
      return assertUnreachable(node);
  }
}
