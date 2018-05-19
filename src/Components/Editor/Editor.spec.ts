import * as uuid from 'uuid';
import { NodeType, ActionType, RootNode, SetCursorAction } from './model';
import { calcNewTree } from './calcNewTree';
import { expectToEqual } from './expectToEqual';

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
                value: 'A',
                cursor: { from: 1, to: 1 },
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
                value: 'AA',
                cursor: { from: 2, to: 2 },
              },
            },
          },
        },
      };
      expectToEqual(after, expected);
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
                cursor: { from: 0, to: 0 },
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
                cursor: { from: 4, to: 4 },
              },
            },
          },
        },
      };
      expectToEqual(after, expected);
    });
    test('insert text where cursor is', () => {
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
                value: 'arnar',
                cursor: { from: 2, to: 2 },
              },
            },
          },
        },
      };
      const after = calcNewTree(
        { type: ActionType.InsertText, text: 'ö', composing: false },
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
                value: 'arönar',
                cursor: { from: 3, to: 3 },
              },
            },
          },
        },
      };
      expectToEqual(after, expected);
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
                cursor: { from: 5, to: 5 },
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
                cursor: { from: 4, to: 4 },
              },
            },
          },
        },
      };
      expectToEqual(after, expected);
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
                cursor: { from: 0, to: 0 },
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
                cursor: { from: 1, to: 1 },
              },
            },
          },
        },
      };
      expectToEqual(after, expected);
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
                cursor: { from: 7, to: 7 },
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
                cursor: { from: 8, to: 8 },
              },
            },
          },
        },
      };
      expectToEqual(after, expected);
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
                cursor: { from: 8, to: 8 },
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
                cursor: { from: 9, to: 9 },
              },
            },
          },
        },
      };
      expectToEqual(after, expected);
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
                cursor: { from: 11, to: 11 },
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
                cursor: { from: 14, to: 14 },
              },
            },
          },
        },
      };
      expectToEqual(after, expected);
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
                cursor: { from: 7, to: 7 },
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
                cursor: { from: 9, to: 9 },
              },
            },
          },
        },
      };
      expectToEqual(after, expected);
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
                cursor: { from: 7, to: 7 },
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
                cursor: { from: 9, to: 9 },
              },
            },
          },
        },
      };
      expectToEqual(after, expected);
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
                cursor: { from: 8, to: 8 },
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
                cursor: { from: 9, to: 9 },
              },
            },
          },
        },
      };
      expectToEqual(after, expected);
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
                cursor: { from: 1, to: 1 },
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
                cursor: { from: 2, to: 2 },
                value: 'aá',
              },
            },
          },
        },
      };
      expectToEqual(after, expected);
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
                cursor: { from: 1, to: 1 },
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
                cursor: { from: 1, to: 1 },
                value: 'á',
              },
            },
          },
        },
      };
      expectToEqual(after, expected);
    });
    test('remove dead node & merge text nodes', () => {
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
              t1: {
                id: 't1',
                type: NodeType.Text,
                cursor: undefined,
                value: 'ab',
              },
              d: {
                id: 'd',
                type: NodeType.Dead,
                cursor: { from: 1, to: 1 },
                value: '´',
              },
              t2: {
                id: 't2',
                type: NodeType.Text,
                cursor: undefined,
                value: 'ba',
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
            cursor: 't1',
            children: {
              t1: {
                id: 't1',
                type: NodeType.Text,
                cursor: { from: 3, to: 3 },
                value: 'abába',
              },
            },
          },
        },
      };
      expectToEqual(after, expected);
    });
    test('remove selection and insert text', () => {
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
                value: 'bar biz foo',
                cursor: { from: 8, to: 11 },
              },
            },
          },
        },
      };
      const actual = calcNewTree(
        { type: ActionType.InsertText, text: 'k', composing: false },
        before,
      );
      const expected: RootNode = {
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
                value: 'bar biz k',
                cursor: { from: 9, to: 9 },
              },
            },
          },
        },
      };
      expectToEqual(actual, expected);
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
                cursor: { from: 0, to: 0 },
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
                cursor: { from: 3, to: 3 },
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
        cursor: 'p1',
        children: {
          p1: {
            id: 'p1',
            type: NodeType.Paragraph,
            cursor: 't1',
            children: {
              t1: {
                id: 't1',
                type: NodeType.Text,
                value: 'aaa',
                cursor: { from: 3, to: 3 },
              },
            },
          },
        },
      };
      const after = calcNewTree({ type: ActionType.Backspace }, before, uuid);
      const expected: RootNode = {
        id: 'root',
        type: NodeType.Root,
        cursor: 'p1',
        children: {
          p1: {
            id: 'p1',
            type: NodeType.Paragraph,
            cursor: 't1',
            children: {
              t1: {
                id: 't1',
                type: NodeType.Text,
                value: 'aa',
                cursor: { from: 2, to: 2 },
              },
            },
          },
        },
      };
      expectToEqual(after, expected);
    });
    test('remove char from node with cursor 2', () => {
      const before: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p',
        children: {
          p: {
            id: 'p',
            type: NodeType.Paragraph,
            cursor: 't1',
            children: {
              t1: {
                id: 't1',
                type: NodeType.Text,
                cursor: { from: 3, to: 3 },
                value: 'ab´cd',
              },
            },
          },
        },
      };
      const actual = calcNewTree({ type: ActionType.Backspace }, before, uuid);
      const expected: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p',
        children: {
          p: {
            id: 'p',
            type: NodeType.Paragraph,
            cursor: 't1',
            children: {
              t1: {
                id: 't1',
                type: NodeType.Text,
                cursor: { from: 2, to: 2 },
                value: 'abcd',
              },
            },
          },
        },
      };
      expectToEqual(actual, expected);
    });
    test(`don't remove paragraph if deleting last char`, () => {
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
                cursor: { from: 0, to: 0 },
              },
            },
          },
        },
      };
      const expected = before;
      const after = calcNewTree({ type: ActionType.Backspace }, before, uuid);
      expectToEqual(after, expected);
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
                value: '',
              },
              d: {
                id: 'd',
                type: NodeType.Dead,
                cursor: { from: 1, to: 1 },
                value: '´',
              },
            },
          },
        },
      };
      const after = calcNewTree({ type: ActionType.Backspace }, before, uuid);
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
                cursor: { from: 0, to: 0 },
                value: '',
              },
            },
          },
        },
      };
      expectToEqual(after, expected);
    });
    test('remove dead node and merge', () => {
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
              t1: {
                id: 't1',
                type: NodeType.Text,
                cursor: undefined,
                value: 'ab',
              },
              d: {
                id: 'd',
                type: NodeType.Dead,
                cursor: { from: 1, to: 1 },
                value: '´',
              },
              t2: {
                id: 't2',
                type: NodeType.Text,
                cursor: undefined,
                value: 'cd',
              },
            },
          },
        },
      };
      const after = calcNewTree({ type: ActionType.Backspace }, before, uuid);
      const expected: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p',
        children: {
          p: {
            id: 'p',
            type: NodeType.Paragraph,
            cursor: 't1',
            children: {
              t1: {
                id: 't1',
                type: NodeType.Text,
                cursor: { from: 2, to: 2 },
                value: 'abcd',
              },
            },
          },
        },
      };
      expectToEqual(after, expected);
    });
    test('delete paragraph if not the last one', () => {
      const before: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p2',
        children: {
          p1: {
            id: 'p1',
            type: NodeType.Paragraph,
            cursor: undefined,
            children: {
              t1: {
                id: 't1',
                type: NodeType.Text,
                value: 'A',
                cursor: undefined,
              },
            },
          },
          p2: {
            id: 'p2',
            type: NodeType.Paragraph,
            cursor: 't2',
            children: {
              t2: {
                id: 't2',
                type: NodeType.Text,
                value: '',
                cursor: { from: 0, to: 0 },
              },
            },
          },
        },
      };
      const actual = calcNewTree({ type: ActionType.Backspace }, before);
      const expected: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p1',
        children: {
          p1: {
            id: 'p1',
            type: NodeType.Paragraph,
            cursor: 't1',
            children: {
              t1: {
                id: 't1',
                type: NodeType.Text,
                value: 'A',
                cursor: { from: 1, to: 1 },
              },
            },
          },
        },
      };
      expectToEqual(actual, expected);
    });
    test('delete paragraph if not the last one 2', () => {
      const before: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p2',
        children: {
          p1: {
            id: 'p1',
            type: NodeType.Paragraph,
            cursor: undefined,
            children: {
              t1: {
                id: 't1',
                type: NodeType.Text,
                value: 'Arnar',
                cursor: undefined,
              },
            },
          },
          p2: {
            id: 'p2',
            type: NodeType.Paragraph,
            cursor: 't2',
            children: {
              t2: {
                id: 't2',
                type: NodeType.Text,
                value: '',
                cursor: { from: 0, to: 0 },
              },
            },
          },
          p3: {
            id: 'p3',
            type: NodeType.Paragraph,
            cursor: undefined,
            children: {
              t3: {
                id: 't3',
                type: NodeType.Text,
                value: 'Foo',
                cursor: undefined,
              },
            },
          },
        },
      };
      const actual = calcNewTree({ type: ActionType.Backspace }, before);
      const expected: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p1',
        children: {
          p1: {
            id: 'p1',
            type: NodeType.Paragraph,
            cursor: 't1',
            children: {
              t1: {
                id: 't1',
                type: NodeType.Text,
                value: 'Arnar',
                cursor: { from: 5, to: 5 },
              },
            },
          },
          p3: {
            id: 'p3',
            type: NodeType.Paragraph,
            cursor: undefined,
            children: {
              t3: {
                id: 't3',
                type: NodeType.Text,
                value: 'Foo',
                cursor: undefined,
              },
            },
          },
        },
      };
      expectToEqual(actual, expected);
    });
    test(`don't remove paragraph if deleting last char and return same root`, () => {
      const before: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p1',
        children: {
          p1: {
            id: 'p1',
            type: NodeType.Paragraph,
            cursor: 't1',
            children: {
              t1: {
                id: 't1',
                type: NodeType.Text,
                value: '',
                cursor: { from: 0, to: 0 },
              },
            },
          },
          p2: {
            id: 'p2',
            type: NodeType.Paragraph,
            cursor: undefined,
            children: {
              t2: {
                id: 't2',
                type: NodeType.Text,
                value: '',
                cursor: undefined,
              },
            },
          },
        },
      };
      const actual = calcNewTree({ type: ActionType.Backspace }, before);
      const expected: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p1',
        children: {
          p1: {
            id: 'p1',
            type: NodeType.Paragraph,
            cursor: 't1',
            children: {
              t1: {
                id: 't1',
                type: NodeType.Text,
                value: '',
                cursor: { from: 0, to: 0 },
              },
            },
          },
          p2: {
            id: 'p2',
            type: NodeType.Paragraph,
            cursor: undefined,
            children: {
              t2: {
                id: 't2',
                type: NodeType.Text,
                value: '',
                cursor: undefined,
              },
            },
          },
        },
      };
      expectToEqual(actual, expected);
      expect(before).toBe(actual);
    });
    test('remove selection', () => {
      const before: RootNode = {
        id: 'root',
        type: NodeType.Root,
        cursor: 'p1',
        children: {
          p1: {
            id: 'p1',
            type: NodeType.Paragraph,
            cursor: 't1',
            children: {
              t1: {
                id: 't1',
                type: NodeType.Text,
                value: 'aaa bbb ccc',
                cursor: { from: 4, to: 7 },
              },
            },
          },
        },
      };
      const actual = calcNewTree({ type: ActionType.Backspace }, before, uuid);
      const expected: RootNode = {
        id: 'root',
        type: NodeType.Root,
        cursor: 'p1',
        children: {
          p1: {
            id: 'p1',
            type: NodeType.Paragraph,
            cursor: 't1',
            children: {
              t1: {
                id: 't1',
                type: NodeType.Text,
                value: 'aaa  ccc',
                cursor: { from: 4, to: 4 },
              },
            },
          },
        },
      };
      expectToEqual(actual, expected);
    });
  });
  describe('on DeadAction', () => {
    test('add dead node 0', () => {
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
                cursor: { from: 0, to: 0 },
                value: '',
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
                value: '',
              },
              d: {
                id: 'd',
                type: NodeType.Dead,
                cursor: { from: 1, to: 1 },
                value: '´',
              },
            },
          },
        },
      };
      expectToEqual(after, expected);
    });
    test('add dead node 1', () => {
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
                cursor: { from: 1, to: 1 },
                value: 'a',
              },
            },
          },
        },
      };
      const genIdMock = jest
        .fn<() => string>()
        .mockImplementationOnce(() => 'd');
      const actual = calcNewTree({ type: ActionType.Dead }, before, genIdMock);
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
                cursor: { from: 1, to: 1 },
                value: '´',
              },
            },
          },
        },
      };
      expectToEqual(actual, expected);
    });
    test('add dead node where cursor is', () => {
      const before: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p',
        children: {
          p: {
            id: 'p',
            type: NodeType.Paragraph,
            cursor: 't1',
            children: {
              t1: {
                id: 't1',
                type: NodeType.Text,
                cursor: { from: 2, to: 2 },
                value: 'abba',
              },
            },
          },
        },
      };
      const genIdMock = jest
        .fn<() => string>()
        .mockImplementationOnce(() => 'd')
        .mockImplementationOnce(() => 't2');
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
              t1: {
                id: 't1',
                type: NodeType.Text,
                cursor: undefined,
                value: 'ab',
              },
              d: {
                id: 'd',
                type: NodeType.Dead,
                cursor: { from: 1, to: 1 },
                value: '´',
              },
              t2: {
                id: 't2',
                type: NodeType.Text,
                cursor: undefined,
                value: 'ba',
              },
            },
          },
        },
      };
      expectToEqual(after, expected);
    });
    test('add dead node where cursor is with space', () => {
      const before: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p',
        children: {
          p: {
            id: 'p',
            type: NodeType.Paragraph,
            cursor: 't1',
            children: {
              t1: {
                id: 't1',
                type: NodeType.Text,
                cursor: { from: 0, to: 0 },
                value: ' abba',
              },
            },
          },
        },
      };
      const genIdMock = jest
        .fn<() => string>()
        .mockImplementationOnce(() => 'd')
        .mockImplementationOnce(() => 't2');
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
              t1: {id: 't1', type: NodeType.Text, cursor: undefined, value: ''},
              d: {
                id: 'd',
                type: NodeType.Dead,
                cursor: { from: 1, to: 1 },
                value: '´',
              },
              t2: {
                id: 't2',
                type: NodeType.Text,
                cursor: undefined,
                value: ' abba',
              },
            },
          },
        },
      };
      expectToEqual(after, expected);
    });
    test('add dead node & remove previous dead node', () => {
      const before: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p',
        children: {
          p: {
            id: 'p',
            type: NodeType.Paragraph,
            cursor: 'd1',
            children: {
              t: {
                id: 't',
                type: NodeType.Text,
                cursor: undefined,
                value: 'a',
              },
              d1: {
                id: 'd1',
                type: NodeType.Dead,
                cursor: { from: 1, to: 1 },
                value: '´',
              },
            },
          },
        },
      };
      const genIdMock = jest
        .fn<() => string>()
        .mockImplementationOnce(() => 'd2');
      const after = calcNewTree({ type: ActionType.Dead }, before, genIdMock);
      const expected: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p',
        children: {
          p: {
            id: 'p',
            type: NodeType.Paragraph,
            cursor: 'd2',
            children: {
              t: {
                id: 't',
                type: NodeType.Text,
                cursor: undefined,
                value: 'a´',
              },
              d2: {
                id: 'd2',
                type: NodeType.Dead,
                cursor: { from: 1, to: 1 },
                value: '´',
              },
            },
          },
        },
      };
      expectToEqual(after, expected);
    });
    test('add dead node, remove previous dead node, merge text node', () => {
      const before: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p',
        children: {
          p: {
            id: 'p',
            type: NodeType.Paragraph,
            cursor: 'd1',
            children: {
              t1: {
                id: 't1',
                type: NodeType.Text,
                cursor: undefined,
                value: 'ab',
              },
              d1: {
                id: 'd1',
                type: NodeType.Dead,
                cursor: { from: 1, to: 1 },
                value: '´',
              },
              t2: {
                id: 't2',
                type: NodeType.Text,
                cursor: undefined,
                value: 'ba',
              },
            },
          },
        },
      };
      const genIdMock = jest
        .fn<() => string>()
        .mockImplementationOnce(() => 'd2')
        .mockImplementationOnce(() => 't3');
      const after = calcNewTree({ type: ActionType.Dead }, before, genIdMock);
      const expected: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p',
        children: {
          p: {
            id: 'p',
            type: NodeType.Paragraph,
            cursor: 'd2',
            children: {
              t1: {
                id: 't1',
                type: NodeType.Text,
                cursor: undefined,
                value: 'ab´',
              },
              d2: {
                id: 'd2',
                type: NodeType.Dead,
                cursor: { from: 1, to: 1 },
                value: '´',
              },
              t3: {
                id: 't3',
                type: NodeType.Text,
                cursor: undefined,
                value: 'ba',
              },
            },
          },
        },
      };
      expectToEqual(after, expected);
    });
    test('replace selection', () => {
      const before: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p1',
        children: {
          p1: {
            id: 'p1',
            type: NodeType.Paragraph,
            cursor: 't1',
            children: {
              t1: {
                id: 't1',
                type: NodeType.Text,
                cursor: { from: 0, to: 3 },
                value: 'aaa bbb',
              },
            },
          },
        },
      };
      const genIdMock = jest
        .fn<() => string>()
        .mockImplementationOnce(() => 'd')
        .mockImplementationOnce(() => 't2');
      const actual = calcNewTree({ type: ActionType.Dead }, before, genIdMock);
      const expected: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p1',
        children: {
          p1: {
            id: 'p1',
            type: NodeType.Paragraph,
            cursor: 'd',
            children: {
              t1: {id: 't1', type: NodeType.Text, cursor: undefined, value: ''},
              d: {
                id: 'd',
                type: NodeType.Dead,
                cursor: { from: 1, to: 1 },
                value: '´',
              },
              t2: {
                id: 't2',
                type: NodeType.Text,
                cursor: undefined,
                value: ' bbb',
              },
            },
          },
        },
      };
      expectToEqual(actual, expected);
    });
  });
  describe('on MoveCursorAction', () => {
    test('move cursor back', () => {
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
                value: 'arnar',
                cursor: { from: 5, to: 5 },
              },
            },
          },
        },
      };
      const after = calcNewTree(
        { type: ActionType.MoveCursor, value: -1 },
        before,
        uuid,
      );
      const expected: RootNode = {
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
                value: 'arnar',
                cursor: { from: 4, to: 4 },
              },
            },
          },
        },
      };
      expectToEqual(after, expected);
    });
    test('move cursor back but stop at beginning and return same root', () => {
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
                value: 'arnar',
                cursor: { from: 0, to: 0 },
              },
            },
          },
        },
      };
      const after = calcNewTree(
        { type: ActionType.MoveCursor, value: -1 },
        before,
        uuid,
      );
      expect(after).toBe(before);
    });
    test('move cursor back and to previous paragraph', () => {
      const before: RootNode = {
        id: 'root',
        type: NodeType.Root,
        cursor: 'p2',
        children: {
          p1: {
            id: 'p1',
            type: NodeType.Paragraph,
            cursor: undefined,
            children: {
              t1: {
                id: 't1',
                type: NodeType.Text,
                value: 'lína 1',
                cursor: undefined,
              },
            },
          },
          p2: {
            id: 'p2',
            type: NodeType.Paragraph,
            cursor: 't2',
            children: {
              t2: {
                id: 't2',
                type: NodeType.Text,
                value: 'lína 2',
                cursor: { from: 0, to: 0 },
              },
            },
          },
        },
      };
      const actual = calcNewTree(
        { type: ActionType.MoveCursor, value: -1 },
        before,
        uuid,
      );
      const expected: RootNode = {
        id: 'root',
        type: NodeType.Root,
        cursor: 'p1',
        children: {
          p1: {
            id: 'p1',
            type: NodeType.Paragraph,
            cursor: 't1',
            children: {
              t1: {
                id: 't1',
                type: NodeType.Text,
                value: 'lína 1',
                cursor: { from: 6, to: 6 },
              },
            },
          },
          p2: {
            id: 'p2',
            type: NodeType.Paragraph,
            cursor: undefined,
            children: {
              t2: {
                id: 't2',
                type: NodeType.Text,
                value: 'lína 2',
                cursor: undefined,
              },
            },
          },
        },
      };
      expectToEqual(actual, expected);
    });
    test('move cursor back between text nodes', () => {
      const before: RootNode = {
        id: 'root',
        type: NodeType.Root,
        cursor: 'p',
        children: {
          p: {
            id: 'p',
            type: NodeType.Paragraph,
            cursor: 't2',
            children: {
              t1: {
                id: 't1',
                type: NodeType.Text,
                value: 'ar',
                cursor: undefined,
              },
              t2: {
                id: 't2',
                type: NodeType.Text,
                value: 'nar',
                cursor: { from: 0, to: 0 },
              },
            },
          },
        },
      };
      const after = calcNewTree(
        { type: ActionType.MoveCursor, value: -1 },
        before,
        uuid,
      );
      const expected: RootNode = {
        id: 'root',
        type: NodeType.Root,
        cursor: 'p',
        children: {
          p: {
            id: 'p',
            type: NodeType.Paragraph,
            cursor: 't1',
            children: {
              t1: {
                id: 't1',
                type: NodeType.Text,
                value: 'ar',
                cursor: { from: 1, to: 1 },
              },
              t2: {
                id: 't2',
                type: NodeType.Text,
                value: 'nar',
                cursor: undefined,
              },
            },
          },
        },
      };
      expectToEqual(after, expected);
    });
    test('move cursor forward from zero', () => {
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
                value: 'arnar',
                cursor: { from: 0, to: 0 },
              },
            },
          },
        },
      };
      const after = calcNewTree(
        { type: ActionType.MoveCursor, value: 1 },
        before,
        uuid,
      );
      const expected: RootNode = {
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
                value: 'arnar',
                cursor: { from: 1, to: 1 },
              },
            },
          },
        },
      };
      expectToEqual(after, expected);
    });
    test('move cursor forward', () => {
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
                value: 'arnar',
                cursor: { from: 3, to: 3 },
              },
            },
          },
        },
      };
      const after = calcNewTree(
        { type: ActionType.MoveCursor, value: 1 },
        before,
        uuid,
      );
      const expected: RootNode = {
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
                value: 'arnar',
                cursor: { from: 4, to: 4 },
              },
            },
          },
        },
      };
      expectToEqual(after, expected);
    });
    test('move cursor forward 2', () => {
      const before: RootNode = {
        id: 'root',
        type: NodeType.Root,
        cursor: 'p',
        children: {
          p: {
            id: 'p',
            type: NodeType.Paragraph,
            cursor: 't2',
            children: {
              t1: {
                id: 't1',
                type: NodeType.Text,
                value: 'ar',
                cursor: undefined,
              },
              t2: {
                id: 't2',
                type: NodeType.Text,
                value: 'nar',
                cursor: { from: 0, to: 0 },
              },
            },
          },
        },
      };
      const after = calcNewTree(
        { type: ActionType.MoveCursor, value: 1 },
        before,
        uuid,
      );
      const expected: RootNode = {
        id: 'root',
        type: NodeType.Root,
        cursor: 'p',
        children: {
          p: {
            id: 'p',
            type: NodeType.Paragraph,
            cursor: 't2',
            children: {
              t1: {
                id: 't1',
                type: NodeType.Text,
                value: 'ar',
                cursor: undefined,
              },
              t2: {
                id: 't2',
                type: NodeType.Text,
                value: 'nar',
                cursor: { from: 1, to: 1 },
              },
            },
          },
        },
      };
      expectToEqual(after, expected);
    });
    test('move cursor forward between text nodes', () => {
      const before: RootNode = {
        id: 'root',
        type: NodeType.Root,
        cursor: 'p',
        children: {
          p: {
            id: 'p',
            type: NodeType.Paragraph,
            cursor: 't1',
            children: {
              t1: {
                id: 't1',
                type: NodeType.Text,
                value: 'ar',
                cursor: { from: 2, to: 2 },
              },
              t2: {
                id: 't2',
                type: NodeType.Text,
                value: 'nar',
                cursor: undefined,
              },
            },
          },
        },
      };
      const after = calcNewTree(
        { type: ActionType.MoveCursor, value: 1 },
        before,
        uuid,
      );
      const expected: RootNode = {
        id: 'root',
        type: NodeType.Root,
        cursor: 'p',
        children: {
          p: {
            id: 'p',
            type: NodeType.Paragraph,
            cursor: 't2',
            children: {
              t1: {
                id: 't1',
                type: NodeType.Text,
                value: 'ar',
                cursor: undefined,
              },
              t2: {
                id: 't2',
                type: NodeType.Text,
                value: 'nar',
                cursor: { from: 1, to: 1 },
              },
            },
          },
        },
      };
      expectToEqual(after, expected);
    });
    test('move cursor forward but stop at the end and return same root', () => {
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
                value: 'arnar',
                cursor: { from: 5, to: 5 },
              },
            },
          },
        },
      };
      const actual = calcNewTree(
        { type: ActionType.MoveCursor, value: 1 },
        before,
        uuid,
      );
      expect(actual).toBe(before);
    });
    test('move cursor forward and to next paragraph', () => {
      const before: RootNode = {
        id: 'root',
        type: NodeType.Root,
        cursor: 'p1',
        children: {
          p1: {
            id: 'p1',
            type: NodeType.Paragraph,
            cursor: 't1',
            children: {
              t1: {
                id: 't1',
                type: NodeType.Text,
                value: 'lína 1',
                cursor: { from: 6, to: 6 },
              },
            },
          },
          p2: {
            id: 'p2',
            type: NodeType.Paragraph,
            cursor: undefined,
            children: {
              t2: {
                id: 't2',
                type: NodeType.Text,
                value: 'lína 2',
                cursor: undefined,
              },
            },
          },
        },
      };
      const actual = calcNewTree(
        { type: ActionType.MoveCursor, value: 1 },
        before,
        uuid,
      );
      const expected: RootNode = {
        id: 'root',
        type: NodeType.Root,
        cursor: 'p2',
        children: {
          p1: {
            id: 'p1',
            type: NodeType.Paragraph,
            cursor: undefined,
            children: {
              t1: {
                id: 't1',
                type: NodeType.Text,
                value: 'lína 1',
                cursor: undefined,
              },
            },
          },
          p2: {
            id: 'p2',
            type: NodeType.Paragraph,
            cursor: 't2',
            children: {
              t2: {
                id: 't2',
                type: NodeType.Text,
                value: 'lína 2',
                cursor: { from: 0, to: 0 },
              },
            },
          },
        },
      };
      expectToEqual(actual, expected);
    });
    test('remove dead node left', () => {
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
                cursor: { from: 1, to: 1 },
                value: '´',
              },
            },
          },
        },
      };
      const after = calcNewTree(
        { type: ActionType.MoveCursor, value: -1 },
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
                cursor: { from: 1, to: 1 },
                value: 'a´',
              },
            },
          },
        },
      };
      expectToEqual(after, expected);
    });
    test('remove dead node right', () => {
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
                cursor: { from: 1, to: 1 },
                value: '´',
              },
            },
          },
        },
      };
      const after = calcNewTree(
        { type: ActionType.MoveCursor, value: 1 },
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
                cursor: { from: 2, to: 2 },
                value: 'a´',
              },
            },
          },
        },
      };
      expectToEqual(after, expected);
    });
    test('if only on text node has range selection, move cursor to selection to to', () => {
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
                value: 'arnar',
                cursor: { from: 0, to: 5 },
              },
            },
          },
        },
      };
      const after = calcNewTree(
        { type: ActionType.MoveCursor, value: 1 },
        before,
        uuid,
      );
      const expected: RootNode = {
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
                value: 'arnar',
                cursor: { from: 5, to: 5 },
              },
            },
          },
        },
      };
      expectToEqual(after, expected);
    })
    test('if only on text node has range selection, move cursor to selection to from', () => {
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
                value: 'arnar',
                cursor: { from: 0, to: 5 },
              },
            },
          },
        },
      };
      const after = calcNewTree(
        { type: ActionType.MoveCursor, value: -1 },
        before,
        uuid,
      );
      const expected: RootNode = {
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
                value: 'arnar',
                cursor: { from: 0, to: 0 },
              },
            },
          },
        },
      };
      expectToEqual(after, expected);
    })
  });
  describe('on SetCursorAction', () => {
    test('set cursor position', () => {
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
                value: 'AA',
                cursor: { from: 2, to: 2 },
              },
            },
          },
        },
      };
      const action: SetCursorAction = {
        type: ActionType.SetCursor,
        nodeId: 't',
        pos: 0,
      };
      const after = calcNewTree(action, before, uuid);
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
                value: 'AA',
                cursor: { from: 0, to: 0 },
              },
            },
          },
        },
      };
      expectToEqual(after, expected);
    });
    test('set cursor position 2', () => {
      const before: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p1',
        children: {
          p1: {
            id: 'p1',
            type: NodeType.Paragraph,
            cursor: 't1',
            children: {
              t1: {
                id: 't1',
                type: NodeType.Text,
                value: 'AA',
                cursor: { from: 2, to: 2 },
              },
            },
          },
          p2: {
            id: 'p2',
            type: NodeType.Paragraph,
            cursor: undefined,
            children: {
              t2: {
                id: 't2',
                type: NodeType.Text,
                value: 'bb',
                cursor: undefined,
              },
            },
          },
        },
      };
      const action: SetCursorAction = {
        type: ActionType.SetCursor,
        nodeId: 't2',
        pos: 1,
      };
      const after = calcNewTree(action, before, uuid);
      const expected: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p2',
        children: {
          p1: {
            id: 'p1',
            type: NodeType.Paragraph,
            cursor: undefined,
            children: {
              t1: {
                id: 't1',
                type: NodeType.Text,
                value: 'AA',
                cursor: undefined,
              },
            },
          },
          p2: {
            id: 'p2',
            type: NodeType.Paragraph,
            cursor: 't2',
            children: {
              t2: {
                id: 't2',
                type: NodeType.Text,
                value: 'bb',
                cursor: { from: 1, to: 1 },
              },
            },
          },
        },
      };
      expectToEqual(after, expected);
    });
    test('set cursor position 3', () => {
      const before: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p1',
        children: {
          p1: {
            id: 'p1',
            type: NodeType.Paragraph,
            cursor: 't1',
            children: {
              t1: {
                id: 't1',
                type: NodeType.Text,
                value: 'AA',
                cursor: { from: 0, to: 2 },
              },
            },
          },
          p2: {
            id: 'p2',
            type: NodeType.Paragraph,
            cursor: undefined,
            children: {
              t2: {
                id: 't2',
                type: NodeType.Text,
                value: 'bb',
                cursor: undefined,
              },
            },
          },
        },
      };
      const action: SetCursorAction = {
        type: ActionType.SetCursor,
        nodeId: 't2',
        pos: 1,
      };
      const after = calcNewTree(action, before, uuid);
      const expected: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p2',
        children: {
          p1: {
            id: 'p1',
            type: NodeType.Paragraph,
            cursor: undefined,
            children: {
              t1: {
                id: 't1',
                type: NodeType.Text,
                value: 'AA',
                cursor: undefined,
              },
            },
          },
          p2: {
            id: 'p2',
            type: NodeType.Paragraph,
            cursor: 't2',
            children: {
              t2: {
                id: 't2',
                type: NodeType.Text,
                value: 'bb',
                cursor: { from: 1, to: 1 },
              },
            },
          },
        },
      };
      expectToEqual(after, expected);
    });
    test('return same tree if set cursor is current cursor', () => {
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
                value: 'AA',
                cursor: { from: 2, to: 2 },
              },
            },
          },
        },
      };
      const action: SetCursorAction = {
        type: ActionType.SetCursor,
        nodeId: 't',
        pos: 2,
      };
      const after = calcNewTree(action, before, uuid);
      expect(after).toBe(before);
    });
    test('return same tree if set cursor is current cursor 2', () => {
      const before: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p1',
        children: {
          p1: {
            id: 'p1',
            type: NodeType.Paragraph,
            cursor: 't1',
            children: {
              t: {
                id: 't1',
                type: NodeType.Text,
                value: 'AA',
                cursor: { from: 2, to: 2 },
              },
            },
          },
          p2: {
            id: 'p2',
            type: NodeType.Paragraph,
            cursor: undefined,
            children: {
              t2: {
                id: 't2',
                type: NodeType.Text,
                value: 'bb',
                cursor: undefined,
              },
            },
          },
        },
      };
      const action: SetCursorAction = {
        type: ActionType.SetCursor,
        nodeId: 't1',
        pos: 2,
      };
      const after = calcNewTree(action, before, uuid);
      expect(after).toBe(before);
    });
    test('convert dead node to text node before setting the cursor', () => {
      const before: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p1',
        children: {
          p1: {
            id: 'p1',
            type: NodeType.Paragraph,
            cursor: 'd',
            children: {
              t1: {
                id: 't1',
                type: NodeType.Text,
                cursor: undefined,
                value: 'abba',
              },
              d: {
                id: 'd',
                type: NodeType.Dead,
                cursor: { from: 1, to: 1 },
                value: '´',
              },
            },
          },
          p2: {
            id: 'p2',
            type: NodeType.Paragraph,
            cursor: undefined,
            children: {
              t2: {
                id: 't2',
                type: NodeType.Text,
                cursor: undefined,
                value: 'baab',
              },
            },
          },
        },
      };
      const actual = calcNewTree(
        { type: ActionType.SetCursor, nodeId: 't2', pos: 2 },
        before,
        uuid,
      );
      const expected: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p2',
        children: {
          p1: {
            id: 'p1',
            type: NodeType.Paragraph,
            cursor: undefined,
            children: {
              t1: {
                id: 't1',
                type: NodeType.Text,
                cursor: undefined,
                value: 'abba´',
              },
            },
          },
          p2: {
            id: 'p2',
            type: NodeType.Paragraph,
            cursor: 't2',
            children: {
              t2: {
                id: 't2',
                type: NodeType.Text,
                cursor: { from: 2, to: 2 },
                value: 'baab',
              },
            },
          },
        },
      };
      expectToEqual(actual, expected);
    });
  });
  describe('on EnterAction', () => {
    test('insert newline', () => {
      const before: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p1',
        children: {
          p1: {
            id: 'p1',
            type: NodeType.Paragraph,
            cursor: 't1',
            children: {
              t1: {
                id: 't1',
                type: NodeType.Text,
                value: 'AA',
                cursor: { from: 2, to: 2 },
              },
            },
          },
        },
      };
      const genIdMock = jest
        .fn<() => string>()
        .mockImplementationOnce(() => 'p2')
        .mockImplementationOnce(() => 't2');
      const after = calcNewTree({ type: ActionType.Enter }, before, genIdMock);
      const expected: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p2',
        children: {
          p1: {
            id: 'p1',
            type: NodeType.Paragraph,
            cursor: undefined,
            children: {
              t1: {
                id: 't1',
                type: NodeType.Text,
                value: 'AA',
                cursor: undefined,
              },
            },
          },
          p2: {
            id: 'p2',
            type: NodeType.Paragraph,
            cursor: 't2',
            children: {
              t2: {
                id: 't2',
                type: NodeType.Text,
                value: '',
                cursor: { from: 0, to: 0 },
              },
            },
          },
        },
      };
      expectToEqual(after, expected);
    });
    test('insert newline 2', () => {
      const before: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p1',
        children: {
          p1: {
            id: 'p1',
            type: NodeType.Paragraph,
            cursor: 't1',
            children: {
              t1: {
                id: 't1',
                type: NodeType.Text,
                value: 'AA',
                cursor: { from: 1, to: 1 },
              },
            },
          },
        },
      };
      const genIdMock = jest
        .fn<() => string>()
        .mockImplementationOnce(() => 'p2')
        .mockImplementationOnce(() => 't2');
      const after = calcNewTree({ type: ActionType.Enter }, before, genIdMock);
      const expected: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p2',
        children: {
          p1: {
            id: 'p1',
            type: NodeType.Paragraph,
            cursor: undefined,
            children: {
              t1: {
                id: 't1',
                type: NodeType.Text,
                value: 'A',
                cursor: undefined,
              },
            },
          },
          p2: {
            id: 'p2',
            type: NodeType.Paragraph,
            cursor: 't2',
            children: {
              t2: {
                id: 't2',
                type: NodeType.Text,
                value: 'A',
                cursor: { from: 0, to: 0 },
              },
            },
          },
        },
      };
      expectToEqual(after, expected);
    });
    test('insert newline 3', () => {
      const before: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p1',
        children: {
          p1: {
            id: 'p1',
            type: NodeType.Paragraph,
            cursor: 't1',
            children: {
              t1: {
                id: 't1',
                type: NodeType.Text,
                value: 'AA',
                cursor: { from: 1, to: 1 },
              },
            },
          },
          p3: {
            id: 'p3',
            type: NodeType.Paragraph,
            cursor: undefined,
            children: {
              t3: {
                id: 't3',
                type: NodeType.Text,
                value: 'P3',
                cursor: undefined,
              },
            },
          },
        },
      };
      const genIdMock = jest
        .fn<() => string>()
        .mockImplementationOnce(() => 'p2')
        .mockImplementationOnce(() => 't2');
      const after = calcNewTree({ type: ActionType.Enter }, before, genIdMock);
      const expected: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p2',
        children: {
          p1: {
            id: 'p1',
            type: NodeType.Paragraph,
            cursor: undefined,
            children: {
              t1: {
                id: 't1',
                type: NodeType.Text,
                value: 'A',
                cursor: undefined,
              },
            },
          },
          p2: {
            id: 'p2',
            type: NodeType.Paragraph,
            cursor: 't2',
            children: {
              t2: {
                id: 't2',
                type: NodeType.Text,
                value: 'A',
                cursor: { from: 0, to: 0 },
              },
            },
          },
          p3: {
            id: 'p3',
            type: NodeType.Paragraph,
            cursor: undefined,
            children: {
              t3: {
                id: 't3',
                type: NodeType.Text,
                value: 'P3',
                cursor: undefined,
              },
            },
          },
        },
      };
      expectToEqual(after, expected);
    });
    test('insert newline 4', () => {
      const before: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p2',
        children: {
          p1: {
            id: 'p1',
            type: NodeType.Paragraph,
            cursor: undefined,
            children: {
              t1: {
                id: 't1',
                type: NodeType.Text,
                value: 'A',
                cursor: undefined,
              },
            },
          },
          p2: {
            id: 'p2',
            type: NodeType.Paragraph,
            cursor: 't2',
            children: {
              t2: {
                id: 't2',
                type: NodeType.Text,
                value: 'A',
                cursor: { from: 1, to: 1 },
              },
            },
          },
          p3: {
            id: 'p3',
            type: NodeType.Paragraph,
            cursor: undefined,
            children: {
              t3: {
                id: 't3',
                type: NodeType.Text,
                value: 'P3',
                cursor: undefined,
              },
            },
          },
        },
      };
      const genIdMock = jest
        .fn<() => string>()
        .mockImplementationOnce(() => 'p4')
        .mockImplementationOnce(() => 't4');
      const after = calcNewTree({ type: ActionType.Enter }, before, genIdMock);
      const expected: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p4',
        children: {
          p1: {
            id: 'p1',
            type: NodeType.Paragraph,
            cursor: undefined,
            children: {
              t1: {
                id: 't1',
                type: NodeType.Text,
                value: 'A',
                cursor: undefined,
              },
            },
          },
          p2: {
            id: 'p2',
            type: NodeType.Paragraph,
            cursor: undefined,
            children: {
              t2: {
                id: 't2',
                type: NodeType.Text,
                value: 'A',
                cursor: undefined,
              },
            },
          },
          p4: {
            id: 'p4',
            type: NodeType.Paragraph,
            cursor: 't4',
            children: {
              t4: {
                id: 't4',
                type: NodeType.Text,
                value: '',
                cursor: { from: 0, to: 0 },
              },
            },
          },
          p3: {
            id: 'p3',
            type: NodeType.Paragraph,
            cursor: undefined,
            children: {
              t3: {
                id: 't3',
                type: NodeType.Text,
                value: 'P3',
                cursor: undefined,
              },
            },
          },
        },
      };
      expectToEqual(after, expected);
    });
    test('remove dead node & insert newline', () => {
      const before: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p1',
        children: {
          p1: {
            id: 'p1',
            type: NodeType.Paragraph,
            cursor: 'd',
            children: {
              t1: {
                id: 't1',
                type: NodeType.Text,
                value: 'AA',
                cursor: undefined,
              },
              d: {
                id: 'd',
                type: NodeType.Dead,
                value: '´',
                cursor: { from: 1, to: 1 },
              },
            },
          },
        },
      };
      const genIdMock = jest
        .fn<() => string>()
        .mockImplementationOnce(() => 'p2')
        .mockImplementationOnce(() => 't2');
      const after = calcNewTree({ type: ActionType.Enter }, before, genIdMock);
      const expected: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p2',
        children: {
          p1: {
            id: 'p1',
            type: NodeType.Paragraph,
            cursor: undefined,
            children: {
              t1: {
                id: 't1',
                type: NodeType.Text,
                value: 'AA´',
                cursor: undefined,
              },
            },
          },
          p2: {
            id: 'p2',
            type: NodeType.Paragraph,
            cursor: 't2',
            children: {
              t2: {
                id: 't2',
                type: NodeType.Text,
                value: '',
                cursor: { from: 0, to: 0 },
              },
            },
          },
        },
      };
      expectToEqual(after, expected);
    });
    test('clear selection and then insert newline', () => {
      const before: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p1',
        children: {
          p1: {
            id: 'p1',
            type: NodeType.Paragraph,
            cursor: 't1',
            children: {
              t1: {
                id: 't1',
                type: NodeType.Text,
                value: 'AA bb cc',
                cursor: { from: 3, to: 5 },
              },
            },
          },
        },
      };
      const genIdMock = jest
        .fn<() => string>()
        .mockImplementationOnce(() => 'p2')
        .mockImplementationOnce(() => 't2');
      const after = calcNewTree({ type: ActionType.Enter }, before, genIdMock);
      const expected: RootNode = {
        id: 'r',
        type: NodeType.Root,
        cursor: 'p2',
        children: {
          p1: {
            id: 'p1',
            type: NodeType.Paragraph,
            cursor: undefined,
            children: {
              t1: {
                id: 't1',
                type: NodeType.Text,
                value: 'AA ',
                cursor: undefined,
              },
            },
          },
          p2: {
            id: 'p2',
            type: NodeType.Paragraph,
            cursor: 't2',
            children: {
              t2: {
                id: 't2',
                type: NodeType.Text,
                value: ' cc',
                cursor: { from: 0, to: 0 },
              },
            },
          },
        },
      };
      expectToEqual(after, expected);
    })
  });
  describe('on SelectWordAction', () => {
    test('should select word 1', () => {
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
                value: 'arnar',
                cursor: { from: 0, to: 0 },
              },
            },
          },
        },
      };
      const actual0 = calcNewTree(
        { type: ActionType.SelectWord, nodeId: 't', index: 0 },
        before,
        uuid,
      );
      const actual1 = calcNewTree(
        { type: ActionType.SelectWord, nodeId: 't', index: 1 },
        before,
        uuid,
      );
      const actual2 = calcNewTree(
        { type: ActionType.SelectWord, nodeId: 't', index: 2 },
        before,
        uuid,
      );
      const actual3 = calcNewTree(
        { type: ActionType.SelectWord, nodeId: 't', index: 3 },
        before,
        uuid,
      );
      const actual4 = calcNewTree(
        { type: ActionType.SelectWord, nodeId: 't', index: 4 },
        before,
        uuid,
      );
      const expected: RootNode = {
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
                value: 'arnar',
                cursor: { from: 0, to: 5 },
              },
            },
          },
        },
      };
      expectToEqual(actual0, expected);
      expectToEqual(actual1, expected);
      expectToEqual(actual2, expected);
      expectToEqual(actual3, expected);
      expectToEqual(actual4, expected);
    });
    test('should select word 2', () => {
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
                value: 'bar biz foo',
                cursor: { from: 0, to: 0 },
              },
            },
          },
        },
      };
      const actual0 = calcNewTree(
        { type: ActionType.SelectWord, nodeId: 't', index: 0 },
        before,
        uuid,
      );
      const actual1 = calcNewTree(
        { type: ActionType.SelectWord, nodeId: 't', index: 1 },
        before,
        uuid,
      );
      const actual2 = calcNewTree(
        { type: ActionType.SelectWord, nodeId: 't', index: 2 },
        before,
        uuid,
      );
      const expected: RootNode = {
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
                value: 'bar biz foo',
                cursor: { from: 0, to: 3 },
              },
            },
          },
        },
      };
      expectToEqual(actual0, expected);
      expectToEqual(actual1, expected);
      expectToEqual(actual2, expected);
    });
    test('should select word 3', () => {
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
                value: 'bar biz foo',
                cursor: { from: 0, to: 0 },
              },
            },
          },
        },
      };
      const actual0 = calcNewTree(
        { type: ActionType.SelectWord, nodeId: 't', index: 4 },
        before,
        uuid,
      );
      const actual1 = calcNewTree(
        { type: ActionType.SelectWord, nodeId: 't', index: 5 },
        before,
        uuid,
      );
      const actual2 = calcNewTree(
        { type: ActionType.SelectWord, nodeId: 't', index: 6 },
        before,
        uuid,
      );
      const expected: RootNode = {
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
                value: 'bar biz foo',
                cursor: { from: 4, to: 7 },
              },
            },
          },
        },
      };
      expectToEqual(actual0, expected);
      expectToEqual(actual1, expected);
      expectToEqual(actual2, expected);
    });
    test('should select word 4', () => {
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
                value: 'bar biz foo',
                cursor: { from: 0, to: 0 },
              },
            },
          },
        },
      };
      const actual0 = calcNewTree(
        { type: ActionType.SelectWord, nodeId: 't', index: 8 },
        before,
        uuid,
      );
      const actual1 = calcNewTree(
        { type: ActionType.SelectWord, nodeId: 't', index: 9 },
        before,
        uuid,
      );
      const actual2 = calcNewTree(
        { type: ActionType.SelectWord, nodeId: 't', index: 10 },
        before,
        uuid,
      );
      const expected: RootNode = {
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
                value: 'bar biz foo',
                cursor: { from: 8, to: 11 },
              },
            },
          },
        },
      };
      expectToEqual(actual0, expected);
      expectToEqual(actual1, expected);
      expectToEqual(actual2, expected);
    });
    test('should select whitespace', () => {
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
                value: 'bar biz foo',
                cursor: { from: 0, to: 0 },
              },
            },
          },
        },
      };
      const actual = calcNewTree(
        { type: ActionType.SelectWord, nodeId: 't', index: 3 },
        before,
        uuid,
      );
      const expected: RootNode = {
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
                value: 'bar biz foo',
                cursor: { from: 3, to: 4 },
              },
            },
          },
        },
      };
      expectToEqual(actual, expected);
    });
    test('should select whitespace 2', () => {
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
                value: 'bar  biz foo',
                cursor: { from: 0, to: 0 },
              },
            },
          },
        },
      };
      const actual = calcNewTree(
        { type: ActionType.SelectWord, nodeId: 't', index: 3 },
        before,
        uuid,
      );
      const expected: RootNode = {
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
                value: 'bar  biz foo',
                cursor: { from: 3, to: 5 },
              },
            },
          },
        },
      };
      expectToEqual(actual, expected);
    });
  });
});
