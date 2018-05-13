import {
  SetCursorAction,
  LeafNode,
  EditorNode,
  NodeType,
  RootNode,
  ParagraphNode,
} from './model';
import { assertUnreachable } from '../../Utils/assertUnreachable';
import { isEmpty } from '../../Utils/isEmpty';

export function setCursor(action: SetCursorAction, node: RootNode): RootNode;
export function setCursor(
  action: SetCursorAction,
  node: ParagraphNode,
): ParagraphNode;
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
          node.cursor === action.pos) ||
        (node.id !== action.nodeId && node.cursor === undefined)
      ) {
        return node;
      }
      return {
        ...node,
        cursor: action.nodeId === node.id ? action.pos : undefined,
      };
    }
    case NodeType.Dead:
      return node;
    default:
      return assertUnreachable(node);
  }
}
