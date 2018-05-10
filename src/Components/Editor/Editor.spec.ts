import * as uuid from 'uuid';
import { NodeType, ActionType, RootNode } from './model';
import { calcNewTree } from './calcNewTree';

describe('calcNewNode should', () => {
  describe('on InsertTextAction', () => {
    test('return new root', () => {
      const before: RootNode = {
        id: 'root',
        type: NodeType.Root,
        cursor: 'p',
        children: {
          p: {
            id: 'p',
            type: NodeType.Paragraph,
            cursor: 't',
            children: {
              t: {
                id: 't',
                type: NodeType.Text,
                value: '',
              },
            },
          },
        },
      };
      const after = calcNewTree(
        { type: ActionType.InsertText, text: 'A', composing: false },
        before,
        uuid,
      );
      expect(after).not.toBe(before);
    });
    test('return tree with text added and cursor moved', () => {
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
      const after = calcNewTree(
        { type: ActionType.InsertText, text: 'A', composing: false },
        before,
        uuid,
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
    test('return tree with text added and cursor moved 2', () => {
      const before: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p',
        children: {
          p: {
            id: 'p',
            type: NodeType.Paragraph,
            cursor: 't',
            children: {
              t: {
                id: 't',
                type: NodeType.Text,
                value: '',
                cursor: 0,
              },
            },
          },
        },
      };
      const after = calcNewTree(
        { type: ActionType.InsertText, text: 'Hann', composing: false },
        before,
        uuid,
      );
      const expected: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p',
        children: {
          p: {
            id: 'p',
            type: NodeType.Paragraph,
            cursor: 't',
            children: {
              t: {
                id: 't',
                type: NodeType.Text,
                value: 'Hann',
                cursor: 4,
              },
            },
          },
        },
      };
      expect(after).toEqual(expected);
    });
    test('composing android backspace', () => {
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
                value: 'Thank',
                cursor: 5,
              },
            },
          },
        },
      };
      const after = calcNewTree(
        { type: ActionType.InsertText, text: 'Than', composing: true },
        before,
        uuid,
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
                value: 'Than',
                cursor: 4,
              },
            },
          },
        },
      };
      expect(after).toEqual(expected);
    });
    test('composing 1', () => {
      const before: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p',
        children: {
          p: {
            id: 'p',
            type: NodeType.Paragraph,
            cursor: 't',
            children: {
              t: {
                id: 't',
                type: NodeType.Text,
                value: '',
                cursor: 0,
              },
            },
          },
        },
      };
      const after = calcNewTree(
        { type: ActionType.InsertText, text: 'H', composing: true },
        before,
        uuid,
      );
      const expected: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p',
        children: {
          p: {
            id: 'p',
            type: NodeType.Paragraph,
            cursor: 't',
            children: {
              t: {
                id: 't',
                type: NodeType.Text,
                value: 'H',
                cursor: 1,
              },
            },
          },
        },
      };
      expect(after).toEqual(expected);
    });
    test('composing 2', () => {
      const before: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p',
        children: {
          p: {
            id: 'p',
            type: NodeType.Paragraph,
            cursor: 't',
            children: {
              t: {
                id: 't',
                type: NodeType.Text,
                value: 'Thanks ',
                cursor: 7,
              },
            },
          },
        },
      };
      const after = calcNewTree(
        { type: ActionType.InsertText, text: 'h', composing: true },
        before,
        uuid,
      );
      const expected: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p',
        children: {
          p: {
            id: 'p',
            type: NodeType.Paragraph,
            cursor: 't',
            children: {
              t: {
                id: 't',
                type: NodeType.Text,
                value: 'Thanks h',
                cursor: 8,
              },
            },
          },
        },
      };
      expect(after).toEqual(expected);
    });
    test('composing 3', () => {
      const before: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p',
        children: {
          p: {
            id: 'p',
            type: NodeType.Paragraph,
            cursor: 't',
            children: {
              t: {
                id: 't',
                type: NodeType.Text,
                value: 'Thanks h',
                cursor: 8,
              },
            },
          },
        },
      };
      const after = calcNewTree(
        { type: ActionType.InsertText, text: 'hk', composing: true },
        before,
        uuid,
      );
      const expected: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p',
        children: {
          p: {
            id: 'p',
            type: NodeType.Paragraph,
            cursor: 't',
            children: {
              t: {
                id: 't',
                type: NodeType.Text,
                value: 'Thanks hk',
                cursor: 9,
              },
            },
          },
        },
      };
      expect(after).toEqual(expected);
    });
    test('composing 4', () => {
      const before: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p',
        children: {
          p: {
            id: 'p',
            type: NodeType.Paragraph,
            cursor: 't',
            children: {
              t: {
                id: 't',
                type: NodeType.Text,
                value: 'Thanks for ',
                cursor: 11,
              },
            },
          },
        },
      };
      const after = calcNewTree(
        { type: ActionType.InsertText, text: 'the', composing: true },
        before,
        uuid,
      );
      const expected: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p',
        children: {
          p: {
            id: 'p',
            type: NodeType.Paragraph,
            cursor: 't',
            children: {
              t: {
                id: 't',
                type: NodeType.Text,
                value: 'Thanks for the',
                cursor: 14,
              },
            },
          },
        },
      };
      expect(after).toEqual(expected);
    });
    test('composing 4', () => {
      const before: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p',
        children: {
          p: {
            id: 'p',
            type: NodeType.Paragraph,
            cursor: 't',
            children: {
              t: {
                id: 't',
                type: NodeType.Text,
                value: 'Thanks for the',
                cursor: 7,
              },
            },
          },
        },
      };
      const after = calcNewTree(
        { type: ActionType.InsertText, text: 'at', composing: true },
        before,
        uuid,
      );
      const expected: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p',
        children: {
          p: {
            id: 'p',
            type: NodeType.Paragraph,
            cursor: 't',
            children: {
              t: {
                id: 't',
                type: NodeType.Text,
                value: 'Thanks at the',
                cursor: 9,
              },
            },
          },
        },
      };
      expect(after).toEqual(expected);
    });
    test('composing cursor at start of word', () => {
      const before: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p',
        children: {
          p: {
            id: 'p',
            type: NodeType.Paragraph,
            cursor: 't',
            children: {
              t: {
                id: 't',
                type: NodeType.Text,
                value: 'Thanks h',
                cursor: 7,
              },
            },
          },
        },
      };
      const after = calcNewTree(
        { type: ActionType.InsertText, text: 'hk', composing: true },
        before,
        uuid,
      );
      const expected: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p',
        children: {
          p: {
            id: 'p',
            type: NodeType.Paragraph,
            cursor: 't',
            children: {
              t: {
                id: 't',
                type: NodeType.Text,
                value: 'Thanks hk',
                cursor: 9,
              },
            },
          },
        },
      };
      expect(after).toEqual(expected);
    });
    test('composing cursor at middle of word', () => {
      const before: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p',
        children: {
          p: {
            id: 'p',
            type: NodeType.Paragraph,
            cursor: 't',
            children: {
              t: {
                id: 't',
                type: NodeType.Text,
                value: 'Thanks abc',
                cursor: 8,
              },
            },
          },
        },
      };
      const after = calcNewTree(
        { type: ActionType.InsertText, text: 'hk', composing: true },
        before,
        uuid,
      );
      const expected: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p',
        children: {
          p: {
            id: 'p',
            type: NodeType.Paragraph,
            cursor: 't',
            children: {
              t: {
                id: 't',
                type: NodeType.Text,
                value: 'Thanks hk',
                cursor: 9,
              },
            },
          },
        },
      };
      expect(after).toEqual(expected);
    });
    test('remove dead node', () => {
      const before: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p',
        children: {
          p: {
            id: 'p',
            type: NodeType.Paragraph,
            cursor: 'd',
            children: {
              t: {
                id: 't',
                type: NodeType.Text,
                cursor: undefined,
                value: 'a',
              },
              d: {
                id: 'd',
                type: NodeType.Dead,
                cursor: 1,
                value: '´',
              },
            },
          },
        },
      };
      const after = calcNewTree(
        { type: ActionType.InsertText, text: 'a', composing: false },
        before,
        uuid,
      );
      const expected: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p',
        children: {
          p: {
            id: 'p',
            type: NodeType.Paragraph,
            cursor: 't',
            children: {
              t: {
                id: 't',
                type: NodeType.Text,
                cursor: 2,
                value: 'aá',
              },
            },
          },
        },
      };
      expect(after).toEqual(expected);
    });
    test('remove dead node 2', () => {
      const before: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p',
        children: {
          p: {
            id: 'p',
            type: NodeType.Paragraph,
            cursor: 'd',
            children: {
              t: {
                id: 't',
                type: NodeType.Text,
                cursor: undefined,
                value: '',
              },
              d: {
                id: 'd',
                type: NodeType.Dead,
                cursor: 1,
                value: '´',
              },
            },
          },
        },
      };
      const after = calcNewTree(
        { type: ActionType.InsertText, text: 'á', composing: false },
        before,
        uuid,
      );
      const expected: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p',
        children: {
          p: {
            id: 'p',
            type: NodeType.Paragraph,
            cursor: 't',
            children: {
              t: {
                id: 't',
                type: NodeType.Text,
                cursor: 1,
                value: 'á',
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
        cursor: 'p',
        children: {
          p: {
            id: 'p',
            type: NodeType.Paragraph,
            cursor: 't',
            children: {
              t: {
                id: 't',
                type: NodeType.Text,
                cursor: 0,
                value: '',
              },
            },
          },
        },
      };
      const after = calcNewTree({ type: ActionType.Backspace }, before, uuid);
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
      const after = calcNewTree({ type: ActionType.Backspace }, before, uuid);
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
      const after = calcNewTree({ type: ActionType.Backspace }, before, uuid);
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
    test(`don't remove paragraph if deleting last char`, () => {
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
      const after = calcNewTree({ type: ActionType.Backspace }, before, uuid);
      expect(after).toEqual(expected);
    });
  });
  describe('on DeadAction', () => {
    test('add dead node', () => {
      const before: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p',
        children: {
          p: {
            id: 'p',
            type: NodeType.Paragraph,
            cursor: 't',
            children: {
              t: {
                id: 't',
                type: NodeType.Text,
                cursor: 1,
                value: 'a',
              },
            },
          },
        },
      };
      const genIdMock = jest
        .fn<() => string>()
        .mockImplementationOnce(() => 'd');
      const after = calcNewTree({ type: ActionType.Dead }, before, genIdMock);
      const expected: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p',
        children: {
          p: {
            id: 'p',
            type: NodeType.Paragraph,
            cursor: 'd',
            children: {
              t: {
                id: 't',
                type: NodeType.Text,
                cursor: undefined,
                value: 'a',
              },
              d: {
                id: 'd',
                type: NodeType.Dead,
                cursor: 1,
                value: '´',
              },
            },
          },
        },
      };
      expect(after).toEqual(expected);
    });
  });
});
