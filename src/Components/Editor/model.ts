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
  Header = 'H',
  Text = 'T',
  Dead = 'D',
}
export type NodeId = string;
export interface BaseNode {
  id: NodeId;
  type: NodeType;
}
export type Cursor<T> = {
  from: T;
  to: T;
};
export interface RootNode extends BaseNode {
  type: NodeType.Root;
  children: Readonly<{ [id: string]: BlockNode }>;
  cursor: NodeId;
}
export interface BaseBlockNode extends BaseNode {
  children: Readonly<{ [id: string]: LeafNode }>;
  cursor?: NodeId;
}
export interface ParagraphNode extends BaseBlockNode {
  type: NodeType.Paragraph;
}
export interface ParagraphNodeWithCursor extends ParagraphNode {
  readonly cursor: NodeId;
}
export interface HeaderNode extends BaseBlockNode {
  type: NodeType.Header;
  level: 1 | 2 | 3 | 4 | 5 | 6;
}
interface BaseTextNode extends BaseNode {
  value: string;
  cursor?: Cursor<number>;
}
export interface TextNode extends BaseTextNode {
  type: NodeType.Text;
}
export interface DeadNode extends BaseTextNode {
  type: NodeType.Dead;
  value: '´';
  cursor: { from: 1; to: 1 };
}
export type EditorNode = RootNode | BlockNode | LeafNode;
export type ContainerNode = RootNode | BlockNode;
export type BlockNode = ParagraphNode | HeaderNode;
export type LeafNode = TextNode | DeadNode;
