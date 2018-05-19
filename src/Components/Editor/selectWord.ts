import {
  SelectWordAction,
  RootNode,
  NodeType,
  BlockNode,
  LeafNode,
  TextNode,
} from './model';
import { assertUnreachable } from '../../Utils/assertUnreachable';
import { containsNode } from './utils';

/**
 *
 * @param action
 * @param node - The node is expected to be clear of all selections.
 */
export function selectWord(action: SelectWordAction, node: RootNode): RootNode;
export function selectWord(
  action: SelectWordAction,
  node: BlockNode,
): BlockNode;
export function selectWord(action: SelectWordAction, node: LeafNode): LeafNode;
export function selectWord(
  action: SelectWordAction,
  node: RootNode | BlockNode | LeafNode,
) {
  switch (node.type) {
    case NodeType.Root: {
      const newChildren: { [id: string]: BlockNode } = {};
      let newCursor = node.cursor;
      Object.values(node.children).forEach(child => {
        if (containsNode(action.nodeId, child)) {
          newCursor = child.id;
          newChildren[child.id] = selectWord(action, child);
        }
      });
      const result: RootNode = {
        ...node,
        cursor: newCursor,
        children: {
          ...node.children,
          ...newChildren,
        },
      };
      return result;
    }
    case NodeType.Header:
    case NodeType.Paragraph: {
      const result: BlockNode = {
        ...node,
        cursor: action.nodeId,
        children: {
          ...node.children,
          [action.nodeId]: selectWord(action, node.children[action.nodeId]),
        },
      };
      return result;
    }
    case NodeType.Text: {
      const isSelectingWhitespace = /\s/.test(node.value.charAt(action.index));
      let from = node.value
        .slice(0, action.index + 1)
        .search(isSelectingWhitespace ? /\s+$/ : /\S+$/);
      if (from === -1) {
        from = 0;
      }
      let to = node.value
        .slice(action.index)
        .search(isSelectingWhitespace ? /\S/ : /\s/);
      if (to === -1) {
        to = node.value.length;
      } else {
        to = action.index + to;
      }
      const result: TextNode = {
        ...node,
        cursor: {
          from,
          to,
        },
      };
      return result;
    }
    case NodeType.Dead: {
      return node;
    }
    default:
      return assertUnreachable(node);
  }
}
