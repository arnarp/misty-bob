import { EditorAction, RootNode, ActionType } from './model';
import { insertText } from './insertText';
import { assertUnreachable } from '../../Utils/assertUnreachable';
import { delChar } from './delChar';
import { addDeadChar } from './addDeadChar';
import { moveCursor } from './moveCursor';
import { setCursor } from './setCursor';

export function calcNewTree(
  action: EditorAction,
  node: RootNode,
  genNodeId: () => string,
): RootNode {
  switch (action.type) {
    case ActionType.InsertText:
      return insertText(action, node, genNodeId);
    case ActionType.Backspace:
      return delChar(action, node);
    case ActionType.Dead:
      return addDeadChar(action, node, genNodeId);
    case ActionType.MoveCursor:
      return moveCursor(action, node);
    case ActionType.SetCursor:
      return setCursor(action, node);
    default:
      return assertUnreachable(action);
  }
}
