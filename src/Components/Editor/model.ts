export const enum ActionType {
  AddChar = 'A',
  Backspace = 'B',
}

export type AddCharAction = {
  type: ActionType.AddChar;
  char: string;
};
export type BackspaceAction = {
  type: ActionType.Backspace;
};

export type EditorAction = AddCharAction | BackspaceAction;

export const enum NodeType {
  Root = 'R',
  Paragraph = 'P',
  Text = 'T',
}
export type NodeId = string;
export type RootNode = Readonly<{
  id: NodeId;
  type: NodeType.Root;
  children: Readonly<{ [id: string]: ParagraphNode }>;
  cursor?: NodeId;
}>;
export type ParagraphNode = Readonly<{
  id: NodeId;
  type: NodeType.Paragraph;
  children: Readonly<{ [id: string]: TextNode }>;
  cursor?: NodeId;
}>;
export type TextNode = Readonly<{
  id: NodeId;
  type: NodeType.Text;
  value: string;
  cursor?: number;
}>;
export type EditorNode = RootNode | ParagraphNode | TextNode;
export type ContainerNode = RootNode | ParagraphNode;
