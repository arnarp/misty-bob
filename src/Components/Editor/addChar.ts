import * as uuid from 'uuid';
import {
  AddCharAction,
  RootNode,
  ParagraphNode,
  TextNode,
  NodeType,
  EditorNode,
} from './model';
import { assertUnreachable } from '../../Utils/assertUnreachable';

export function addChar(action: AddCharAction, node: RootNode): RootNode;
export function addChar(
  action: AddCharAction,
  node: ParagraphNode,
): ParagraphNode | undefined;
export function addChar(
  action: AddCharAction,
  node: TextNode,
): TextNode | undefined;
export function addChar(
  action: AddCharAction,
  node: EditorNode,
): EditorNode | undefined {
  switch (node.type) {
    case NodeType.Root: {
      if (node.cursor === undefined) {
        const textNode: TextNode = {
          id: uuid(),
          type: NodeType.Text,
          cursor: 1,
          value: action.char,
        };
        const pNode: ParagraphNode = {
          id: uuid(),
          type: NodeType.Paragraph,
          cursor: textNode.id,
          children: {
            [textNode.id]: textNode,
          },
        };
        return {
          ...node,
          cursor: pNode.id,
          children: { [pNode.id]: pNode },
        };
      }
      const newChild = addChar(action, node.children[node.cursor]);
      const newChildren = {
        ...node.children,
      };
      if (newChild === undefined) {
        delete newChildren[node.cursor];
      } else {
        newChildren[node.cursor] = newChild;
      }
      return {
        ...node,
        children: newChildren,
      };
    }
    case NodeType.Paragraph: {
      if (node.cursor === undefined) {
        return node;
      }
      const newChild = addChar(action, node.children[node.cursor]);
      const newChildren = {
        ...node.children,
      };
      if (newChild === undefined) {
        delete newChildren[node.cursor];
      } else {
        newChildren[node.cursor] = newChild;
      }
      return {
        ...node,
        children: newChildren,
      };
    }
    case NodeType.Text: {
      if (node.cursor === undefined) {
        return node;
      }
      return {
        ...node,
        value: node.value + action.char,
        cursor: node.cursor + 1,
      };
    }
    default:
      return assertUnreachable(node);
  }
}

// if (node.type === NodeType.Paragraph) {
//   node.cursor;
// }
// if (node.cursor === true) {
//   return {
//     ...node,
//     value:
//       node.value === undefined ? action.char : node.value + action.char,
//   };
// }
// if (typeof node.cursor === 'string' && node.children) {
//   return {
//     ...node,
//     children: {
//       ...node.children,
//       [node.cursor]: calcNewNode(action, node.children[node.cursor])!,
//     },
//   };
// }
// return node;
