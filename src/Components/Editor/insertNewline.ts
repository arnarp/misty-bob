import {
  RootNode,
  EditorNode,
  ParagraphNode,
  TextNode,
  DeadNode,
  NodeType,
} from './model';
import { assertUnreachable } from '../../Utils/assertUnreachable';

export function insertNewline(
  node: RootNode,
  genNodeId: () => string,
): RootNode;
export function insertNewline(node: EditorNode, genNodeId: () => string) {
  switch (node.type) {
    case NodeType.Root: {
      const childWithCursor = node.children[node.cursor];
      const newChildWithCursorId = genNodeId();
      const newTextNodeId = genNodeId();
      return {
        ...node,
        cursor: newChildWithCursorId,
        children: {
          ...node.children,
          [childWithCursor.id]: clearCursor(childWithCursor),
          [newChildWithCursorId]: {
            id: newChildWithCursorId,
            type: NodeType.Paragraph,
            cursor: newTextNodeId,
            children: {
              [newTextNodeId]: {
                id: newTextNodeId,
                type: NodeType.Text,
                cursor: 0,
                value: '',
              },
            },
          },
        },
      };
    }
    case NodeType.Paragraph:
    case NodeType.Text:
    case NodeType.Dead:
      return node;
    default:
      return assertUnreachable(node);
  }
}

function clearCursor(node: RootNode): RootNode;
function clearCursor(node: ParagraphNode): ParagraphNode;
function clearCursor(node: TextNode): TextNode;
function clearCursor(node: DeadNode): DeadNode;
function clearCursor(node: EditorNode): EditorNode {
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
          [childWithCursor.id]: clearCursor(childWithCursor),
        },
      };
    }
    case NodeType.Paragraph: {
      const childWithCursor = node.children[node.cursor];
      return {
        ...node,
        cursor: undefined,
        children: {
          ...node.children,
          [childWithCursor.id]:
            childWithCursor.type === NodeType.Text
              ? clearCursor(childWithCursor)
              : clearCursor(childWithCursor),
        },
      };
    }
    case NodeType.Text: {
      return {
        ...node,
        cursor: undefined,
      };
    }
    case NodeType.Dead:
      return node;
    default:
      return assertUnreachable(node);
  }
}
