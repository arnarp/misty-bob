import * as React from 'react';
import './RichTextContent.css';
import { stateToHTML } from 'draft-js-export-html';
import { ContentState } from 'draft-js';

type RichTextContentProps = { content: ContentState };

export const RichTextContent: React.SFC<RichTextContentProps> = props => (
  <div
    className="RichText"
    dangerouslySetInnerHTML={{
      __html: stateToHTML(props.content),
    }}
  />
);
