import { MoveCursorAction, NodeType, RootNode, ParagraphNode } from './model';
import { assertUnreachable } from '../../Utils/assertUnreachable';
import { getNextChild, getPreviousChild } from './utils';

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
      const newChildren = {
        ...node.children,
        [node.cursor]: newChildWithCursor,
      };
      const isCursorMovingToNextNode =
        action.value === 1 && newChildWithCursor.cursor === undefined;
      const isCursorMovingToPreviousNode =
        action.value === -1 && newChildWithCursor.cursor === undefined;

      const previousChild = getPreviousChild(node.children, node.cursor);
      const nextChild = getNextChild(node.children, node.cursor);

      if (isCursorMovingToPreviousNode && previousChild === undefined) {
        return node;
      }
      if (isCursorMovingToNextNode && nextChild === undefined) {
        return node;
      }
      let newCursor = node.cursor;
      if (isCursorMovingToPreviousNode && previousChild !== undefined) {
        const leafs = Object.values(previousChild.children);
        const lastLeaf = leafs[leafs.length - 1];
        if (lastLeaf.type !== NodeType.Dead) {
          newCursor = previousChild.id;
          newChildren[previousChild.id] = {
            ...previousChild,
            cursor: lastLeaf.id,
            children: {
              ...previousChild.children,
              [lastLeaf.id]: {
                ...lastLeaf,
                cursor: lastLeaf.value.length,
              },
            },
          };
        }
      }
      if (isCursorMovingToNextNode && nextChild !== undefined) {
        const leafs = Object.values(nextChild.children);
        const lastLeaf = leafs[leafs.length - 1];
        if (lastLeaf.type !== NodeType.Dead) {
          newCursor = nextChild.id;
          newChildren[nextChild.id] = {
            ...nextChild,
            cursor: lastLeaf.id,
            children: {
              ...nextChild.children,
              [lastLeaf.id]: {
                ...lastLeaf,
                cursor: 0,
              },
            },
          };
        }
      }

      return {
        ...node,
        cursor: newCursor,
        children: newChildren,
      };
    }
    case NodeType.Paragraph: {
      const childWithCursor = node.children[node.cursor];
      if (
        childWithCursor === undefined ||
        childWithCursor.type === NodeType.Dead ||
        childWithCursor.cursor === undefined
      ) {
        return node;
      }
      const isCursorMovingToPreviousNode =
        childWithCursor.cursor === 0 && action.value === -1;
      const isCursorMovingToNextNode =
        childWithCursor.cursor === childWithCursor.value.length &&
        action.value === 1;
      const newChildren = {
        ...node.children,
        [node.cursor]: {
          ...childWithCursor,
          cursor:
            isCursorMovingToPreviousNode || isCursorMovingToNextNode
              ? undefined
              : childWithCursor.cursor + action.value,
        },
      };
      const previousChild = getPreviousChild(node.children, node.cursor);
      const nextChild = getNextChild(node.children, node.cursor);
      let newCursor = node.cursor as string | undefined;

      if (
        isCursorMovingToPreviousNode &&
        previousChild !== undefined &&
        previousChild.type !== NodeType.Dead
      ) {
        newChildren[previousChild.id] = {
          ...previousChild,
          cursor: previousChild.value.length - 1,
        };
        newCursor = previousChild.id;
      }

      if (
        isCursorMovingToNextNode &&
        nextChild !== undefined &&
        nextChild.type !== NodeType.Dead
      ) {
        newChildren[nextChild.id] = {
          ...nextChild,
          cursor: 1,
        };
        newCursor = nextChild.id;
      }

      if (
        (isCursorMovingToPreviousNode && previousChild === undefined) ||
        (isCursorMovingToNextNode && nextChild === undefined)
      ) {
        newCursor = undefined;
      }

      return {
        ...node,
        cursor: newCursor,
        children: newChildren,
      };
    }
    default:
      return assertUnreachable(node);
  }
}
