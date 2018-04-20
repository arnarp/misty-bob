import * as React from 'react';
import * as classNames from 'classnames';
import { Col } from '../../Components/Layout';
import './Section.css';

type SectionProps = { className?: string; sidePaddings?: boolean };

export const Section: React.SFC<SectionProps> = props => (
  <Col
    className={classNames('Section', props.className, {
      SidePaddings: props.sidePaddings,
    })}
    as="section"
  >
    {props.children}
  </Col>
);
