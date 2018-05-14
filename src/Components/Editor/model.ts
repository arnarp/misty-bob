export const enum ActionType {
  InsertText = 'InsertText',
  Backspace = 'Backspace',
  Enter = 'Enter',
  Dead = 'Dead',
  MoveCursor = 'MoveCursor',
  SetCursor = 'SetCursor',
}

export type InsertTextAction = {
  type: ActionType.InsertText;
  text: string;
  composing: boolean;
};
export type BackspaceAction = {
  type: ActionType.Backspace;
};
export type EnterAction = {
  type: ActionType.Enter;
};
export type DeadAction = {
  type: ActionType.Dead;
};
export type MoveCursorAction = {
  type: ActionType.MoveCursor;
  value: -1 | 1;
};
export type SetCursorAction = {
  type: ActionType.SetCursor;
  nodeId: NodeId;
  pos: number;
};

export type EditorAction =
  | InsertTextAction
  | BackspaceAction
  | EnterAction
  | DeadAction
  | MoveCursorAction
  | SetCursorAction;

export const enum NodeType {
  Root = 'R',
  Paragraph = 'P',
  Text = 'T',
  Dead = 'D',
}
export type NodeId = string;
export type RootNode = Readonly<{
  id: NodeId;
  type: NodeType.Root;
  children: Readonly<{ [id: string]: ParagraphNode }>;
  cursor: NodeId;
}>;
export type ParagraphNode = Readonly<{
  id: NodeId;
  type: NodeType.Paragraph;
  children: Readonly<{ [id: string]: LeafNode }>;
  cursor?: NodeId;
}>;
export type TextNode = Readonly<{
  id: NodeId;
  type: NodeType.Text;
  value: string;
  cursor?: number;
}>;
export type DeadNode = Readonly<{
  id: NodeId;
  type: NodeType.Dead;
  value: '´';
  cursor: 1;
}>;
export type EditorNode = RootNode | ParagraphNode | TextNode | DeadNode;
export type ContainerNode = RootNode | ParagraphNode;
export type LeafNode = TextNode | DeadNode;
