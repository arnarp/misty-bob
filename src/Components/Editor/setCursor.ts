import {
  SetCursorAction,
  LeafNode,
  EditorNode,
  NodeType,
  RootNode,
  BlockNode,
} from './model';
import { assertUnreachable } from '../../Utils/assertUnreachable';
import { isEmpty } from '../../Utils/isEmpty';
import { createCursor } from './utils';

export function setCursor(action: SetCursorAction, node: RootNode): RootNode;
export function setCursor(action: SetCursorAction, node: BlockNode): BlockNode;
export function setCursor(action: SetCursorAction, node: LeafNode): LeafNode;
export function setCursor(
  action: SetCursorAction,
  node: EditorNode,
): EditorNode {
  switch (node.type) {
    case NodeType.Root: {
      const newChildren = {};
      let newCursor = node.cursor;
      for (const childId in node.children) {
        if (node.children.hasOwnProperty(childId)) {
          const newChild = setCursor(action, node.children[childId]);
          if (node.children[childId] !== newChild) {
            newChildren[newChild.id] = newChild;
          }
          if (newChild.cursor !== undefined) {
            newCursor = newChild.id;
          }
        }
      }
      if (!isEmpty(newChildren)) {
        return {
          ...node,
          cursor: newCursor,
          children: {
            ...node.children,
            ...newChildren,
          },
        };
      }
      return node;
    }
    case NodeType.Header:
    case NodeType.Paragraph: {
      const newChildren = {};
      let newCursor = undefined as string | undefined;
      for (const childId in node.children) {
        if (node.children.hasOwnProperty(childId)) {
          const newChild = setCursor(action, node.children[childId]);
          if (node.children[childId] !== newChild) {
            newChildren[newChild.id] = newChild;
          }
          if (newChild.cursor !== undefined) {
            newCursor = newChild.id;
          }
        }
      }
      if (!isEmpty(newChildren)) {
        return {
          ...node,
          cursor: newCursor,
          children: {
            ...node.children,
            ...newChildren,
          },
        };
      }
      return node;
    }
    case NodeType.Text: {
      if (
        (node.id === action.nodeId &&
          node.cursor !== undefined &&
          node.cursor.to === action.pos) ||
        (node.id !== action.nodeId && node.cursor === undefined)
      ) {
        return node;
      }
      return {
        ...node,
        cursor:
          action.nodeId === node.id ? createCursor(action.pos) : undefined,
      };
    }
    case NodeType.Dead:
      return node;
    default:
      return assertUnreachable(node);
  }
}
