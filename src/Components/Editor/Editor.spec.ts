import { EditorNode, NodeType, calcNewNode, ActionType } from './Editor';

describe('calcNewNode should', () => {
  describe('on AddCharAction', () => {
    test('return new node', () => {
      const before: EditorNode = {
        id: 'root',
        type: NodeType.Root,
        cursor: 'first-paragraph',
        children: {
          'first-paragraph': {
            id: 'first-paragraph',
            type: NodeType.Paragraph,
            cursor: true,
          },
        },
      };
      const after = calcNewNode(
        { type: ActionType.AddChar, char: 'A' },
        before,
      );
      expect(after).not.toBe(before);
    });
    test('return tree with char added', () => {
      const before: EditorNode = {
        id: 'root',
        type: NodeType.Root,
        cursor: 'first-paragraph',
        children: {
          'first-paragraph': {
            id: 'first-paragraph',
            type: NodeType.Paragraph,
            cursor: true,
          },
        },
      };
      const after = calcNewNode(
        { type: ActionType.AddChar, char: 'A' },
        before,
      );
      const expected: EditorNode = {
        id: 'root',
        type: NodeType.Root,
        cursor: 'first-paragraph',
        children: {
          'first-paragraph': {
            id: 'first-paragraph',
            type: NodeType.Paragraph,
            cursor: true,
            value: 'A',
          },
        },
      };
      expect(after).toEqual(expected);
    });
  });
});
