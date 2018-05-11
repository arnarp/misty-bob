import { MoveCursorAction, NodeType, RootNode, ParagraphNode } from './model';
import { assertUnreachable } from '../../Utils/assertUnreachable';
import { getPreviousChild } from './utils';

export function moveCursor(action: MoveCursorAction, node: RootNode): RootNode;
export function moveCursor(
  action: MoveCursorAction,
  node: ParagraphNode,
): ParagraphNode;
export function moveCursor(
  action: MoveCursorAction,
  node: RootNode | ParagraphNode,
): RootNode | ParagraphNode {
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
      if (node.cursor === undefined) {
        return node;
      }
      const childWithCursor = node.children[node.cursor];
      if (childWithCursor === undefined) {
        return node;
      }
      if (childWithCursor.type === NodeType.Text) {
        if (
          childWithCursor.cursor === undefined ||
          childWithCursor.cursor === 0
        ) {
          return node;
        }
        if (
          childWithCursor.cursor === childWithCursor.value.length &&
          action.value > 0
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
        // } else if (action.value === -1) {
        //   const previousChild = getPreviousChild(node.children, node.cursor);
        //   if (
        //     previousChild === undefined ||
        //     previousChild.type === NodeType.Dead
        //   ) {
        //     return node;
        //   }
        //   const newChildren = {
        //     ...node.children,
        //   };
        //   newChildren[previousChild.id] = {
        //     ...previousChild,
        //     cursor: previousChild.value.length,
        //     value: previousChild.value + childWithCursor.value,
        //   };
        //   delete newChildren[node.cursor];
        //   return {
        //     ...node,
        //     cursor: previousChild.id,
        //     children: newChildren,
        //   };
      } else {
        const previousChild = getPreviousChild(node.children, node.cursor);
        if (
          previousChild === undefined ||
          previousChild.type === NodeType.Dead
        ) {
          return node;
        }
        const newChildren = {
          ...node.children,
        };
        newChildren[previousChild.id] = {
          ...previousChild,
          cursor: previousChild.value.length + (action.value === -1 ? 0 : 1),
          value: previousChild.value + childWithCursor.value,
        };
        delete newChildren[node.cursor];
        return {
          ...node,
          cursor: previousChild.id,
          children: newChildren,
        };
      }
    }
    default:
      return assertUnreachable(node);
  }
}
