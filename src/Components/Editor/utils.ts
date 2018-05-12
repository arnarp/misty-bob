import {
  InsertTextAction,
  EditorNode,
  NodeType,
  TextNode,
  DeadNode,
  LeafNode,
} from './model';
import { assertUnreachable } from '../../Utils/assertUnreachable';

export function getPreviousChildId(
  children: { [id: string]: {} },
  currentId: string,
) {
  const keys = Object.keys(children);
  const currentIndex = keys.findIndex(v => v === currentId);
  return currentIndex === 0 ? undefined : keys[currentIndex - 1];
}
export function getPreviousChild(
  children: { [id: string]: TextNode | DeadNode },
  currentId: string,
): TextNode | DeadNode;
export function getPreviousChild(
  children: { [id: string]: {} },
  currentId: string,
) {
  const id = getPreviousChildId(children, currentId);
  if (id === undefined) {
    return undefined;
  }
  return children[id];
}
export function getNextChildId(
  children: { [id: string]: {} },
  currentId: string,
) {
  const keys = Object.keys(children);
  const currentIndex = keys.findIndex(v => v === currentId);
  return currentIndex === keys.length - 1 ? undefined : keys[currentIndex + 1];
}
export function getNextChild(
  children: { [id: string]: LeafNode },
  currentId: string,
): LeafNode;
export function getNextChild(
  children: { [id: string]: {} },
  currentId: string,
) {
  const id = getNextChildId(children, currentId);
  if (id === undefined) {
    return undefined;
  }
  return children[id];
}

export function addQuote(action: InsertTextAction): InsertTextAction {
  switch (action.text.toLowerCase()) {
    case 'a':
      return {
        ...action,
        text: String.fromCharCode(action.text.charCodeAt(0) + 128),
      };
    case 'e':
    case 'i':
    case 'o':
    case 'y':
      return {
        ...action,
        text: String.fromCharCode(action.text.charCodeAt(0) + 132),
      };
    case 'u':
      return {
        ...action,
        text: String.fromCharCode(action.text.charCodeAt(0) + 133),
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

declare global {
  interface Window {
    opera?: string;
    MSStream?: string;
  }
}

/**
 * Determine the mobile operating system.
 * This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'.
 */
export function getMobileOperatingSystem() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  if (userAgent === undefined) {
    return undefined;
  }

  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    return 'Windows Phone';
  }

  if (/android/i.test(userAgent)) {
    return 'Android';
  }

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return 'iOS';
  }

  return undefined;
}
