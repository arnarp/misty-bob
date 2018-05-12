import {
  InsertTextAction,
  RootNode,
  ParagraphNode,
  TextNode,
  NodeType,
  EditorNode,
} from './model';
import { assertUnreachable } from '../../Utils/assertUnreachable';
import { addQuote, getPreviousChild, getNextChild } from './utils';

export function insertText(
  action: InsertTextAction,
  node: RootNode,
  genNodeId: () => string,
): RootNode;
export function insertText(
  action: InsertTextAction,
  node: ParagraphNode,
  genNodeId: () => string,
): ParagraphNode;
export function insertText(
  action: InsertTextAction,
  node: TextNode,
  genNodeId: () => string,
): TextNode;
export function insertText(
  action: InsertTextAction,
  node: EditorNode,
  genNodeId: () => string,
): EditorNode | undefined {
  switch (node.type) {
    case NodeType.Root: {
      const newChild = insertText(
        action,
        node.children[node.cursor],
        genNodeId,
      );
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
      const cursorChild = node.children[node.cursor];
      if (cursorChild.type === NodeType.Dead) {
        const newChildren = { ...node.children };
        delete newChildren[node.cursor];
        const previousChild = getPreviousChild(node.children, node.cursor);
        const nextChild = getNextChild(node.children, node.cursor);
        if (
          previousChild === undefined ||
          previousChild.type === NodeType.Dead
        ) {
          return node;
        }
        const newChild = insertText(
          addQuote(action),
          { ...previousChild, cursor: previousChild.value.length },
          genNodeId,
        );
        newChildren[newChild.id] = newChild;
        if (nextChild !== undefined && nextChild.type === NodeType.Text) {
          delete newChildren[nextChild.id];
          newChildren[newChild.id] = {
            ...newChild,
            value: newChild.value + nextChild.value,
          };
        }
        return {
          ...node,
          cursor: newChild.id,
          children: newChildren,
        };
      } else {
        const newChild = insertText(action, cursorChild, genNodeId);
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
    }
    case NodeType.Text: {
      if (node.cursor === undefined) {
        return node;
      }
      if (action.composing) {
        let cursor = node.cursor;
        const wordMap = node.value.split(' ').map((word, index, array) => {
          const start =
            index === 0 ? 0 : array.slice(0, index).join(' ').length + 1;
          return {
            start,
            end: start + word.length,
            word,
          };
        });
        const newTextArr = wordMap.map(value => {
          if (
            node.cursor !== undefined &&
            node.cursor >= value.start &&
            node.cursor <= value.end
          ) {
            cursor = value.start + action.text.length;
            return action.text;
          }
          return value.word;
        });
        return {
          ...node,
          value: newTextArr.join(' '),
          cursor,
        };
      }
      return {
        ...node,
        value:
          node.value.slice(0, node.cursor) +
          action.text +
          node.value.slice(node.cursor),
        cursor: node.cursor + action.text.length,
      };
    }
    case NodeType.Dead:
      return undefined;
    default:
      return assertUnreachable(node);
  }
}
