import { ParagraphNode, NodeType, RootNode } from './model';
import { removeDeadNode } from './removeDeadNode';

describe('removeDeadNode should', () => {
  test(`if node dosen't have cursor then return same node`, () => {
    const before: ParagraphNode = {
      id: 'p',
      type: NodeType.Paragraph,
      cursor: undefined,
      children: {
        t: {
          id: 't',
          type: NodeType.Text,
          value: 'text',
          cursor: undefined,
        },
      },
    };
    const actual = removeDeadNode(before);
    expect(actual).toBe(before);
  });
  test('if child with cursor is not dead node return same node', () => {
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
              value: 'text',
              cursor: { from: 3, to: 3 },
            },
          },
        },
      },
    };
    const actual = removeDeadNode(before);
    expect(actual).toBe(before);
  });
  test('check if cursor node is dead node and remove/merge it to previous text node', () => {
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
              value: 'text',
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
    const actual = removeDeadNode(before);
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
              value: 'text´',
              cursor: { from: 5, to: 5 },
            },
          },
        },
      },
    };
    expect(actual).toEqual(expected);
  });
  test('check if cursor node is dead node and remove/merge it to previous text node and next text node', () => {
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
              value: 'foo',
              cursor: undefined,
            },
            d: {
              id: 'd',
              type: NodeType.Dead,
              value: '´',
              cursor: { from: 1, to: 1 },
            },
            t2: {
              id: 't2',
              type: NodeType.Text,
              value: 'bar',
              cursor: undefined,
            },
          },
        },
      },
    };
    const actual = removeDeadNode(before);
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
              value: 'foo´bar',
              cursor: { from: 4, to: 4 },
            },
          },
        },
      },
    };
    expect(actual).toEqual(expected);
  });
  test('merge', () => {
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
    const actual = removeDeadNode(before);
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
              value: 'ab´cd',
            },
          },
        },
      },
    };
    expect(actual).toEqual(expected);
  });
});
