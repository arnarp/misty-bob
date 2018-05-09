import { AddCharAction, EditorNode, NodeType } from './model';
import { assertUnreachable } from '../../Utils/assertUnreachable';

export function getPreviousChildId(
  children: { [id: string]: {} },
  currentId: string,
) {
  const keys = Object.keys(children);
  const currentIndex = keys.findIndex(v => v === currentId);
  return currentIndex === 0 ? undefined : keys[currentIndex - 1];
}

export function addQuote(action: AddCharAction) {
  switch (action.char.toLowerCase()) {
    case 'a':
      return {
        ...action,
        char: String.fromCharCode(action.char.charCodeAt(0) + 128),
      };
    case 'e':
    case 'i':
    case 'o':
    case 'y':
      return {
        ...action,
        char: String.fromCharCode(action.char.charCodeAt(0) + 132),
      };
    case 'u':
      return {
        ...action,
        char: String.fromCharCode(action.char.charCodeAt(0) + 133),
      };
    default:
      return action;
  }
}

export function getCursorNodeValue(node: EditorNode): undefined | string {
  if (node.cursor === undefined) {
    return undefined;
  }
  switch (node.type) {
    case NodeType.Root:
    case NodeType.Paragraph:
      return getCursorNodeValue(node.children[node.cursor]);
    case NodeType.Text:
    case NodeType.Dead:
      return node.value;
    default:
      return assertUnreachable(node);
  }
}

export function getRawText(node: EditorNode): string {
  switch (node.type) {
    case NodeType.Root:
      return Object.keys(node.children)
        .map(childId => getRawText(node.children[childId]))
        .join('\r\n');
    case NodeType.Paragraph:
      return Object.keys(node.children)
        .map(childId => getRawText(node.children[childId]))
        .join('');
    case NodeType.Text:
    case NodeType.Dead:
      return node.value;
    default:
      return assertUnreachable(node);
  }
}
