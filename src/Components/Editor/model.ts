export const enum ActionType {
  InsertText = 'InsertText',
  Backspace = 'Backspace',
  Enter = 'Enter',
  Dead = 'Dead',
  MoveCursor = 'MoveCursor',
  SetCursor = 'SetCursor',
}

export interface InsertTextAction {
  type: ActionType.InsertText;
  text: string;
  composing: boolean;
}
export interface BackspaceAction {
  type: ActionType.Backspace;
}
export interface EnterAction {
  type: ActionType.Enter;
}
export interface DeadAction {
  type: ActionType.Dead;
}
export interface MoveCursorAction {
  type: ActionType.MoveCursor;
  value: -1 | 1;
}
export interface SetCursorAction {
  type: ActionType.SetCursor;
  nodeId: NodeId;
  pos: number;
}

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
export interface RootNode {
  id: NodeId;
  type: NodeType.Root;
  children: Readonly<{ [id: string]: ParagraphNode }>;
  cursor: NodeId;
}
export interface ParagraphNode {
  id: NodeId;
  type: NodeType.Paragraph;
  children: Readonly<{ [id: string]: LeafNode }>;
  cursor?: NodeId;
}
export interface ParagraphNodeWithCursor extends ParagraphNode {
  readonly cursor: NodeId;
}

interface BaseTextNode {
  id: NodeId;
  value: string;
  cursor?: number;
}

export interface TextNode extends BaseTextNode {
  id: NodeId;
  type: NodeType.Text;
  value: string;
  cursor?: number;
}
export interface DeadNode extends BaseTextNode {
  id: NodeId;
  type: NodeType.Dead;
  value: '´';
  cursor: 1;
}
export type EditorNode = RootNode | ParagraphNode | TextNode | DeadNode;
export type ContainerNode = RootNode | ParagraphNode;
export type LeafNode = TextNode | DeadNode;
