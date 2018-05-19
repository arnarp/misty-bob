import * as uuid from 'uuid';
import { EditorAction, RootNode, ActionType } from './model';
import { insertText } from './insertText';
import { assertUnreachable } from '../../Utils/assertUnreachable';
import { delChar } from './delChar';
import { addDeadChar } from './addDeadChar';
import { moveCursor } from './moveCursor';
import { setCursor } from './setCursor';
import { insertNewline } from './insertNewline';
import { removeDeadNode } from './removeDeadNode';
import { selectWord } from './selectWord';
import { deleteCursorRange } from './deleteCursorRange';

export function calcNewTree(
  action: EditorAction,
  node: RootNode,
  genNodeId: () => string = uuid,
): RootNode {
  switch (action.type) {
    case ActionType.InsertText:
      return insertText(action, deleteCursorRange(node), genNodeId);
    case ActionType.Backspace:
      return delChar(action, removeDeadNode(node));
    case ActionType.Dead:
      return addDeadChar(
        action,
        deleteCursorRange(removeDeadNode(node)),
        genNodeId,
      );
    case ActionType.MoveCursor:
      return moveCursor(action, removeDeadNode(node));
    case ActionType.SetCursor:
      return setCursor(action, removeDeadNode(node));
    case ActionType.Enter:
      return insertNewline(deleteCursorRange(removeDeadNode(node)), genNodeId);
    case ActionType.SelectWord:
      return selectWord(action, node);
    default:
      return assertUnreachable(action);
  }
}
