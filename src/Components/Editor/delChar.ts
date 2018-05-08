import {
  BackspaceAction,
  RootNode,
  ParagraphNode,
  TextNode,
  EditorNode,
  NodeType,
} from './model';
import { assertUnreachable } from '../../Utils/assertUnreachable';
import { isEmpty, hasOneKey } from '../../Utils/isEmpty';

type DelCharOptions = { keepEmptyString: boolean };
const defaultOpt: DelCharOptions = { keepEmptyString: false };

export function delChar(
  action: BackspaceAction,
  node: RootNode,
  opt?: DelCharOptions,
): RootNode;
export function delChar(
  action: BackspaceAction,
  node: ParagraphNode,
  opt?: DelCharOptions,
): ParagraphNode | undefined;
export function delChar(
  action: BackspaceAction,
  node: TextNode,
  opt?: DelCharOptions,
): TextNode | undefined;
export function delChar(
  action: BackspaceAction,
  node: EditorNode,
  opt: DelCharOptions = defaultOpt,
): EditorNode | undefined {
  switch (node.type) {
    case NodeType.Root: {
      if (node.cursor === undefined) {
        return node;
      }
      const newChild = delChar(action, node.children[node.cursor], {
        keepEmptyString: hasOneKey(node.children),
      });
      const newChildren = {
        ...node.children,
      };
      if (newChild === undefined) {
        delete newChildren[node.cursor];
      } else {
        newChildren[node.cursor] = newChild;
      }
      if (isEmpty(newChildren)) {
        return {
          ...node,
          cursor: undefined,
          children: newChildren,
        };
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
      const newChild = delChar(action, node.children[node.cursor], opt);
      const newChildren = {
        ...node.children,
      };
      if (newChild === undefined) {
        delete newChildren[node.cursor];
      } else {
        newChildren[node.cursor] = newChild;
      }
      if (isEmpty(newChildren)) {
        return undefined;
      } else {
        return {
          ...node,
          children: newChildren,
        };
      }
    }
    case NodeType.Text: {
      if (node.cursor === undefined) {
        return node;
      }
      if (node.value.length === 0 && !opt.keepEmptyString) {
        return undefined;
      }
      return {
        ...node,
        value: node.value.slice(0, -1),
        cursor: Math.max(node.cursor - 1, 0),
      };
    }
    default:
      return assertUnreachable(node);
  }
}
