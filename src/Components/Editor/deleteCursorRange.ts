import { RootNode, EditorNode, BlockNode, LeafNode, NodeType } from './model';
import { assertUnreachable } from '../../Utils/assertUnreachable';

export function deleteCursorRange(node: RootNode): RootNode;
export function deleteCursorRange(node: BlockNode): BlockNode;
export function deleteCursorRange(node: LeafNode): LeafNode;
export function deleteCursorRange(node: EditorNode) {
  if (node.cursor === undefined) {
    return node;
  }
  switch (node.type) {
    case NodeType.Root: {
      const cursorChild = node.children[node.cursor];
      const newCursorChild = deleteCursorRange(cursorChild);
      if (cursorChild === newCursorChild) {
        return node;
      }
      return {
        ...node,
        children: {
          ...node.children,
          [node.cursor]: newCursorChild,
        },
      };
    }
    case NodeType.Header:
    case NodeType.Paragraph: {
      const cursorChild = node.children[node.cursor];
      const newCursorChild = deleteCursorRange(cursorChild);
      if (cursorChild === newCursorChild) {
        return node;
      }
      return {
        ...node,
        children: {
          ...node.children,
          [node.cursor]: newCursorChild,
        },
      };
    }
    case NodeType.Text: {
      const { from, to } = node.cursor;
      if (from === to) {
        return node;
      }
      return {
        ...node,
        cursor: { from, to: from },
        value: node.value.slice(0, from) + node.value.slice(to),
      };
    }
    case NodeType.Dead:
      return node;
    default:
      return assertUnreachable(node);
  }
}
