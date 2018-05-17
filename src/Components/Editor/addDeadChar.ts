import {
  DeadAction,
  RootNode,
  NodeType,
  DeadNode,
  TextNode,
  BlockNode,
} from './model';
import { assertUnreachable } from '../../Utils/assertUnreachable';

export function addDeadChar(
  action: DeadAction,
  node: RootNode,
  genNodeId: () => string,
): RootNode;
export function addDeadChar(
  action: DeadAction,
  node: BlockNode,
  genNodeId: () => string,
): BlockNode;
export function addDeadChar(
  action: DeadAction,
  node: RootNode | BlockNode,
  genNodeId: () => string,
): RootNode | BlockNode {
  if (node.cursor === undefined) {
    return node;
  }
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
    case NodeType.Header:
    case NodeType.Paragraph: {
      const childWithCursor = node.children[node.cursor];
      if (childWithCursor.type === NodeType.Dead) {
        return node;
      }
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
    }
    default:
      return assertUnreachable(node);
  }
}
