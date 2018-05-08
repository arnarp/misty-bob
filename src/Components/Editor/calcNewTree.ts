import { EditorAction, RootNode, ActionType } from './model';
import { addChar } from './addChar';
import { assertUnreachable } from '../../Utils/assertUnreachable';
import { delChar } from './delChar';
import { addDeadChar } from './addDeadChar';

export function calcNewTree(
  action: EditorAction,
  node: RootNode,
  genNodeId: () => string,
): RootNode {
  switch (action.type) {
    case ActionType.AddChar:
      return addChar(action, node, genNodeId);
    case ActionType.Backspace:
      return delChar(action, node, genNodeId);
    case ActionType.Dead:
      return addDeadChar(action, node, genNodeId);
    default:
      return assertUnreachable(action);
  }
}
