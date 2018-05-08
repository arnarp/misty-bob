import {
  DeadAction,
  RootNode,
  ParagraphNode,
  NodeType,
  DeadNode,
} from './model';
import { assertUnreachable } from '../../Utils/assertUnreachable';

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
      return node;
    }
    default:
      return assertUnreachable(node);
  }
}
