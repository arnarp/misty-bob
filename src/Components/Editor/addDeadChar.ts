import {
  DeadAction,
  RootNode,
  ParagraphNode,
  NodeType,
  DeadNode,
  TextNode,
} from './model';
import { assertUnreachable } from '../../Utils/assertUnreachable';
import { getPreviousChild } from './utils';

export function addDeadChar(
  action: DeadAction,
  node: RootNode,
  genNodeId: () => string,
): RootNode;
export function addDeadChar(
  action: DeadAction,
  node: ParagraphNode,
  genNodeId: () => string,
): ParagraphNode;
export function addDeadChar(
  action: DeadAction,
  node: RootNode | ParagraphNode,
  genNodeId: () => string,
): RootNode | ParagraphNode {
  switch (node.type) {
    case NodeType.Root: {
      const childWithCursor = node.children[node.cursor];
      return {
        ...node,
        children: {
          ...node.children,
          [node.cursor]: addDeadChar(action, childWithCursor, genNodeId),
        },
      };
    }
    case NodeType.Paragraph: {
      if (!node.cursor) {
        return node;
      }
      const childWithCursor = node.children[node.cursor];
      if (childWithCursor.type === NodeType.Text) {
        const newDeadNode: DeadNode = {
          id: genNodeId(),
          type: NodeType.Dead,
          value: '´',
          cursor: 1,
        };
        if (
          childWithCursor.cursor &&
          childWithCursor.cursor < childWithCursor.value.length
        ) {
          // We need to split upp current child with cursor and insert dead node in the middle
          const newChildThatHadCursor: TextNode = {
            ...childWithCursor,
            cursor: undefined,
            value: childWithCursor.value.slice(0, childWithCursor.cursor),
          };
          const newRestOfChildThatHadCursor: TextNode = {
            id: genNodeId(),
            type: NodeType.Text,
            cursor: undefined,
            value: childWithCursor.value.slice(childWithCursor.cursor),
          };
          return {
            ...node,
            cursor: newDeadNode.id,
            children: {
              ...node.children,
              [newChildThatHadCursor.id]: newChildThatHadCursor,
              [newDeadNode.id]: newDeadNode,
              [newRestOfChildThatHadCursor.id]: newRestOfChildThatHadCursor,
            },
          };
        } else {
          return {
            ...node,
            cursor: newDeadNode.id,
            children: {
              ...node.children,
              [node.cursor]: {
                ...childWithCursor,
                cursor: undefined,
              },
              [newDeadNode.id]: newDeadNode,
            },
          };
        }
      } else {
        // Child with cursor is a dead node. A dead node should always be
        // preceded by a text node.
        const previousChild = getPreviousChild(node.children, node.cursor);
        if (
          previousChild === undefined ||
          previousChild.type === NodeType.Dead
        ) {
          return node;
        }
        const newPreviousChild = {
          ...previousChild,
          value: previousChild.value + childWithCursor.value,
        };
        return {
          ...node,
          children: {
            ...node.children,
            [newPreviousChild.id]: newPreviousChild,
          },
        };
      }
    }
    default:
      return assertUnreachable(node);
  }
}
