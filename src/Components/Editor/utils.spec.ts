import { calcDistance, containsNode } from './utils';
import { RootNode, NodeType } from './model';

describe('utils', () => {
  describe('calcDistance should', () => {
    test('calc correct distance', () => {
      expect(calcDistance({ x: 0, y: 0 }, { x: 0, y: 10 })).toBeCloseTo(10);
      expect(calcDistance({ x: 0, y: 0 }, { x: 0, y: 0 })).toBeCloseTo(0);
    });
  });
  describe('containsNode should', () => {
    test('return true if any of root node children are the one 0', () => {
      const tree: RootNode = {
        id: 'root',
        type: NodeType.Root,
        cursor: 'p1',
        children: {
          p1: {
            id: 'p1',
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
      expect(containsNode('p1', tree)).toBe(true);
    });
    test('return true if any of root node children are the one 1', () => {
      const tree: RootNode = {
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
                value: 'arnar',
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
                value: 'arnar',
                cursor: undefined,
              },
            },
          },
        },
      };
      expect(containsNode('p2', tree)).toBe(true);
    });
    test('return true if any of root node leafs are the one', () => {
      const tree: RootNode = {
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
                value: 'arnar',
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
                value: 'arnar',
                cursor: undefined,
              },
            },
          },
        },
      };
      expect(containsNode('t1', tree)).toBe(true);
      expect(containsNode('t2', tree)).toBe(true);
    });
    test('return false if it isnt there', () => {
      const tree: RootNode = {
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
                value: 'arnar',
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
                value: 'arnar',
                cursor: undefined,
              },
            },
          },
        },
      };
      expect(containsNode('t4', tree)).toBe(false);
      expect(containsNode('t5', tree)).toBe(false);
    });
  });
});
