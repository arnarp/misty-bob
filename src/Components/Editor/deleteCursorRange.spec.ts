import { RootNode, NodeType } from './model';
import { deleteCursorRange } from './deleteCursorRange';
import { expectToEqual } from './expectToEqual';

describe('deleteCursorRange should', () => {
  test('return same tree if no cursor range', () => {
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
              cursor: { from: 5, to: 5 },
              value: 'arnar foo',
            },
          },
        },
      },
    };
    const actual = deleteCursorRange(before);
    expect(actual).toBe(before);
  });
  test('delete cursor range', () => {
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
              cursor: { from: 0, to: 5 },
              value: 'arnar foo',
            },
          },
        },
      },
    };
    const actual = deleteCursorRange(before);
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
              cursor: { from: 0, to: 0 },
              value: ' foo',
            },
          },
        },
      },
    };
    expectToEqual(actual, expected);
  });
  test('delete cursor range 2', () => {
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
              cursor: { from: 5, to: 6 },
              value: 'arnar foo',
            },
          },
        },
      },
    };
    const actual = deleteCursorRange(before);
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
              cursor: { from: 5, to: 5 },
              value: 'arnarfoo',
            },
          },
        },
      },
    };
    expectToEqual(actual, expected);
  });
  test('delete cursor range 3', () => {
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
              cursor: { from: 6, to: 9 },
              value: 'arnar foo bar',
            },
          },
        },
      },
    };
    const actual = deleteCursorRange(before);
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
              cursor: { from: 6, to: 6 },
              value: 'arnar  bar',
            },
          },
        },
      },
    };
    expectToEqual(actual, expected);
  });
  test('delete cursor range 4', () => {
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
              cursor: { from: 10, to: 13 },
              value: 'arnar foo bar',
            },
          },
        },
      },
    };
    const actual = deleteCursorRange(before);
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
              cursor: { from: 10, to: 10 },
              value: 'arnar foo ',
            },
          },
        },
      },
    };
    expectToEqual(actual, expected);
  });
});
