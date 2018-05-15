import { RootNode, ParagraphNode, NodeType, ContainerNode } from './model';
import { assertUnreachable } from '../../Utils/assertUnreachable';
import { getPreviousChild, getNextChild, textNodesAreMergable } from './utils';

export function removeDeadNode(node: RootNode): RootNode;
export function removeDeadNode(node: ParagraphNode): ParagraphNode;
export function removeDeadNode(node: ContainerNode) {
  if (node.cursor === undefined) {
    return node;
  }
  switch (node.type) {
    case NodeType.Root: {
      const childWithCursor = node.children[node.cursor];
      if (childWithCursor === undefined) {
        return node;
      }
      const newChildWithCursor = removeDeadNode(childWithCursor);
      if (newChildWithCursor === childWithCursor) {
        return node;
      }
      return {
        ...node,
        children: {
          ...node.children,
          [newChildWithCursor.id]: newChildWithCursor,
        },
      };
    }
    case NodeType.Paragraph: {
      const childWithCursor = node.children[node.cursor];
      if (
        childWithCursor === undefined ||
        childWithCursor.type === NodeType.Text
      ) {
        return node;
      }
      // A DeadNode should always be preceeded by at least one text node
      const previousChild = getPreviousChild(node.children, node.cursor);
      if (previousChild === undefined || previousChild.type === NodeType.Dead) {
        return node;
      }
      const nextChild = getNextChild(node.children, node.cursor);
      const shouldMergeWithNextNode =
        nextChild !== undefined &&
        nextChild.type !== NodeType.Dead &&
        textNodesAreMergable(previousChild, nextChild);
      const newChildren = {
        ...node.children,
        [previousChild.id]: {
          ...previousChild,
          cursor: previousChild.value.length + childWithCursor.value.length,
          value: `${previousChild.value}${childWithCursor.value}${
            shouldMergeWithNextNode ? nextChild.value : ''
          }`,
        },
      };
      delete newChildren[childWithCursor.id];
      if (shouldMergeWithNextNode) {
        delete newChildren[nextChild.id];
      }
      return { ...node, children: newChildren, cursor: previousChild.id };
    }
    default:
      return assertUnreachable(node);
  }
}
