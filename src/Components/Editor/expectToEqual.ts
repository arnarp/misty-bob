import { EditorNode, NodeType } from './model';

export function expectToEqual(actual: EditorNode, expected: EditorNode) {
  if (actual.type === NodeType.Root && expected.type === NodeType.Root) {
    expect(actual).toEqual(expected);
  }
  if (
    (actual.type === NodeType.Root || actual.type === NodeType.Paragraph) &&
    (expected.type === NodeType.Root || expected.type === NodeType.Paragraph)
  ) {
    expect(Object.keys(actual.children)).toEqual(
      Object.keys(expected.children),
    );
    Object.keys(actual.children).forEach(i => {
      expectToEqual(actual.children[i], expected.children[i]);
    });
  }
}
