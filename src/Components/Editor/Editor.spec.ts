import { NodeType, ActionType, RootNode } from './model';
import { calcNewNode } from './calcNewNode';

describe('calcNewNode should', () => {
  describe('on AddCharAction', () => {
    test('return new root', () => {
      const before: RootNode = {
        id: 'root',
        type: NodeType.Root,
        children: {},
      };
      const after = calcNewNode(
        { type: ActionType.AddChar, char: 'A' },
        before,
      );
      expect(after).not.toBe(before);
    });
    test('construct new container node if root is empty', () => {
      const before: RootNode = {
        id: 'root',
        type: NodeType.Root,
        children: {},
      };
      const after = calcNewNode(
        { type: ActionType.AddChar, char: 'A' },
        before,
      );
      const expected: RootNode = {
        id: 'root',
        type: NodeType.Root,
        cursor: after.cursor,
        children: {
          [after.cursor!]: {
            id: after.cursor!,
            type: NodeType.Paragraph,
            cursor: after.children[after.cursor!].cursor!,
            children: {
              [after.children[after.cursor!].cursor!]: {
                id: after.children[after.cursor!].cursor!,
                type: NodeType.Text,
                cursor: 1,
                value: 'A',
              },
            },
          },
        },
      };
      expect(after).toEqual(expected);
    });
    test('return tree with char added and cursor moved', () => {
      const before: RootNode = {
        id: 'root',
        type: NodeType.Root,
        cursor: 'first-paragraph',
        children: {
          'first-paragraph': {
            id: 'first-paragraph',
            type: NodeType.Paragraph,
            cursor: 'first-text-node',
            children: {
              'first-text-node': {
                id: 'first-text-node',
                type: NodeType.Text,
                value: 'A',
                cursor: 1,
              },
            },
          },
        },
      };
      const after = calcNewNode(
        { type: ActionType.AddChar, char: 'A' },
        before,
      );
      const expected: RootNode = {
        id: 'root',
        type: NodeType.Root,
        cursor: 'first-paragraph',
        children: {
          'first-paragraph': {
            id: 'first-paragraph',
            type: NodeType.Paragraph,
            cursor: 'first-text-node',
            children: {
              'first-text-node': {
                id: 'first-text-node',
                type: NodeType.Text,
                value: 'AA',
                cursor: 2,
              },
            },
          },
        },
      };
      expect(after).toEqual(expected);
    });
  });
  describe('on BackspaceAction', () => {
    test('return same tree if empty', () => {
      const before: RootNode = {
        id: 'root',
        type: NodeType.Root,
        children: {},
      };
      const after = calcNewNode({ type: ActionType.Backspace }, before);
      expect(after).toBe(before);
    });
    test('return new node when cursor is in text node', () => {
      const before: RootNode = {
        id: 'root',
        type: NodeType.Root,
        cursor: 'first-paragraph',
        children: {
          'first-paragraph': {
            id: 'first-paragraph',
            type: NodeType.Paragraph,
            cursor: 'first-text-node',
            children: {
              'first-text-node': {
                id: 'first-text-node',
                type: NodeType.Text,
                value: 'aaa',
                cursor: 3,
              },
            },
          },
        },
      };
      const after = calcNewNode({ type: ActionType.Backspace }, before);
      expect(after).not.toBe(before);
    });
    test('remove char from node with cursor', () => {
      const before: RootNode = {
        id: 'root',
        type: NodeType.Root,
        cursor: 'first-paragraph',
        children: {
          'first-paragraph': {
            id: 'first-paragraph',
            type: NodeType.Paragraph,
            cursor: 'first-text-node',
            children: {
              'first-text-node': {
                id: 'first-text-node',
                type: NodeType.Text,
                value: 'aaa',
                cursor: 3,
              },
            },
          },
        },
      };
      const after = calcNewNode({ type: ActionType.Backspace }, before);
      const expected: RootNode = {
        id: 'root',
        type: NodeType.Root,
        cursor: 'first-paragraph',
        children: {
          'first-paragraph': {
            id: 'first-paragraph',
            type: NodeType.Paragraph,
            cursor: 'first-text-node',
            children: {
              'first-text-node': {
                id: 'first-text-node',
                type: NodeType.Text,
                value: 'aa',
                cursor: 2,
              },
            },
          },
        },
      };
      expect(after).toEqual(expected);
    });
    test("don't remove paragraph if deleting last char", () => {
      const before: RootNode = {
        id: 'root',
        type: NodeType.Root,
        cursor: 'first-paragraph',
        children: {
          'first-paragraph': {
            id: 'first-paragraph',
            type: NodeType.Paragraph,
            cursor: 'first-text-node',
            children: {
              'first-text-node': {
                id: 'first-text-node',
                type: NodeType.Text,
                value: '',
                cursor: 0,
              },
            },
          },
        },
      };
      const expected = before;
      const after = calcNewNode({ type: ActionType.Backspace }, before);
      expect(after).toEqual(expected);
    });
  });
});
