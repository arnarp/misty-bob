import * as React from 'react';
import { EditorState, RichUtils } from 'draft-js';
import { Button } from '../Buttons';
import './EditorControls.css';

type Block =
  | 'H1'
  | 'H2'
  | 'H3'
  | 'H4'
  | 'H5'
  | 'H6'
  | 'Blockquote'
  | 'UL'
  | 'OL'
  | 'Code Block';

const BLOCK_STYLES: { [B in Block]: { label: string; style: string } } = {
  H1: { label: 'H1', style: 'header-one' },
  H2: { label: 'H2', style: 'header-two' },
  H3: { label: 'H3', style: 'header-three' },
  H4: { label: 'H4', style: 'header-four' },
  H5: { label: 'H5', style: 'header-five' },
  H6: { label: 'H6', style: 'header-six' },
  Blockquote: { label: 'Blockquote', style: 'blockquote' },
  UL: { label: 'UL', style: 'unordered-list-item' },
  OL: { label: 'OL', style: 'ordered-list-item' },
  'Code Block': { label: 'Code Block', style: 'code-block' },
};

type EditorControlsProps = {
  editorState: EditorState;
  blocks: Block[];
  onChange: (editorState: EditorState) => void;
};

export const EditorControls: React.SFC<EditorControlsProps> = ({
  editorState,
  blocks,
  onChange,
}) => {
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();
  return (
    <div className="EditorControls">
      {blocks.map(block => (
        <Button
          color={
            BLOCK_STYLES[block].style === blockType ? 'Primary' : 'Default'
          }
          style="Flat"
          key={BLOCK_STYLES[block].label}
          onClick={() => {
            onChange(
              RichUtils.toggleBlockType(editorState, BLOCK_STYLES[block].style),
            );
          }}
          className="EditorControlsButton"
        >
          {BLOCK_STYLES[block].label}
        </Button>
      ))}
    </div>
  );
};
