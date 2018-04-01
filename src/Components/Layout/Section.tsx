import * as React from 'react';
import * as classNames from 'classnames';
import { Col } from 'src/Components/Layout';
import './Section.css';

type SectionProps = { className?: string; sideMargins?: boolean };

export const Section: React.SFC<SectionProps> = props => (
  <Col
    className={classNames('Section', props.className, {
      SideMargins: props.sideMargins === undefined || props.sideMargins,
    })}
    as="section"
  >
    {props.children}
  </Col>
);
