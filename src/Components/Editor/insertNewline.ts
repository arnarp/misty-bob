import {
  RootNode,
  ParagraphNode,
  NodeType,
  ParagraphNodeWithCursor,
} from './model';
import { createCursor } from './utils';

export function insertNewline(
  node: RootNode,
  genNodeId: () => string,
): RootNode {
  const childWithCursor = node.children[node.cursor];
  if (childWithCursor.cursor === undefined) {
    return node;
  }
  const splitResult = splitParagraph(
    childWithCursor as ParagraphNodeWithCursor,
    genNodeId,
  );
  if (splitResult === undefined) {
    return node;
  }
  const newChildren = {};
  const childrenKeys = Object.keys(node.children);
  const childWithCursorIndex = childrenKeys.findIndex(
    i => i === childWithCursor.id,
  );
  childrenKeys.slice(0, childWithCursorIndex).forEach(i => {
    newChildren[i] = node.children[i];
  });
  newChildren[splitResult.hadCursor.id] = splitResult.hadCursor;
  newChildren[splitResult.hasCursor.id] = splitResult.hasCursor;
  childrenKeys.slice(childWithCursorIndex + 1).forEach(i => {
    newChildren[i] = node.children[i];
  });
  return {
    ...node,
    cursor: splitResult.hasCursor.id,
    children: newChildren,
  };
}

function splitParagraph(
  node: ParagraphNodeWithCursor,
  genNodeId: () => string,
):
  | { hadCursor: ParagraphNode; hasCursor: ParagraphNodeWithCursor }
  | undefined {
  const leafNodeWithCursor = node.children[node.cursor];
  const newChildWithCursorId = genNodeId();
  const newTextNodeId = genNodeId();
  const newTextNodeValue = leafNodeWithCursor.value.slice(
    leafNodeWithCursor.cursor && leafNodeWithCursor.cursor.to,
  );
  if (leafNodeWithCursor.type === NodeType.Dead) {
    return undefined;
  }
  return {
    hadCursor: {
      ...node,
      cursor: undefined,
      children: {
        [node.cursor]: {
          ...leafNodeWithCursor,
          cursor: undefined,
          value: leafNodeWithCursor.value.slice(
            0,
            leafNodeWithCursor.cursor && leafNodeWithCursor.cursor.to,
          ),
        },
      },
    },
    hasCursor: {
      id: newChildWithCursorId,
      type: NodeType.Paragraph,
      cursor: newTextNodeId,
      children: {
        [newTextNodeId]: {
          id: newTextNodeId,
          type: NodeType.Text,
          cursor: createCursor(newTextNodeValue.length),
          value: newTextNodeValue,
        },
      },
    },
  };
}

// function clearCursor(node: RootNode): RootNode;
// function clearCursor(node: ParagraphNode): ParagraphNode;
// function clearCursor(node: TextNode): TextNode;
// function clearCursor(node: DeadNode): DeadNode;
// function clearCursor(node: EditorNode): EditorNode {
//   if (node.cursor === undefined) {
//     return node;
//   }
//   switch (node.type) {
//     case NodeType.Root: {
//       const childWithCursor = node.children[node.cursor];
//       return {
//         ...node,
//         children: {
//           ...node.children,
//           [childWithCursor.id]: clearCursor(childWithCursor),
//         },
//       };
//     }
//     case NodeType.Paragraph: {
//       const childWithCursor = node.children[node.cursor];
//       return {
//         ...node,
//         cursor: undefined,
//         children: {
//           ...node.children,
//           [childWithCursor.id]:
//             childWithCursor.type === NodeType.Text
//               ? clearCursor(childWithCursor)
//               : clearCursor(childWithCursor),
//         },
//       };
//     }
//     case NodeType.Text: {
//       return {
//         ...node,
//         cursor: undefined,
//       };
//     }
//     case NodeType.Dead:
//       return node;
//     default:
//       return assertUnreachable(node);
//   }
// }
