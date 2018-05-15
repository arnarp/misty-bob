import { MoveCursorAction, NodeType, RootNode, ParagraphNode } from './model';
import { assertUnreachable } from '../../Utils/assertUnreachable';

export function moveCursor(action: MoveCursorAction, node: RootNode): RootNode;
export function moveCursor(
  action: MoveCursorAction,
  node: ParagraphNode,
): ParagraphNode;
export function moveCursor(
  action: MoveCursorAction,
  node: RootNode | ParagraphNode,
): RootNode | ParagraphNode {
  if (node.cursor === undefined) {
    return node;
  }
  switch (node.type) {
    case NodeType.Root: {
      const childWithCursor = node.children[node.cursor];
      if (childWithCursor === undefined) {
        return node;
      }
      const newChildWithCursor = moveCursor(action, childWithCursor);
      if (childWithCursor === newChildWithCursor) {
        return node;
      }
      return {
        ...node,
        children: {
          ...node.children,
          [node.cursor]: newChildWithCursor,
        },
      };
    }
    case NodeType.Paragraph: {
      const childWithCursor = node.children[node.cursor];
      if (
        childWithCursor === undefined ||
        childWithCursor.type === NodeType.Dead
      ) {
        return node;
      }
      if (
        childWithCursor.cursor === undefined ||
        (childWithCursor.cursor === 0 && action.value === -1) ||
        (childWithCursor.cursor === childWithCursor.value.length &&
          action.value > 0)
      ) {
        return node;
      }
      return {
        ...node,
        children: {
          [node.cursor]: {
            ...childWithCursor,
            cursor: childWithCursor.cursor + action.value,
          },
        },
      };
    }
    default:
      return assertUnreachable(node);
  }
}
