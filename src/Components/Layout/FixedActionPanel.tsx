import * as React from 'react';
import './FixedActionPanel.css';
import { Row } from './Row';

type FixedActionPanelProps = {};

export const FixedActionPanel: React.SFC<FixedActionPanelProps> = props => (
  <div className="FixedActionPanel">
    <Row spacing="Medium" justifyContent="End">
      {props.children}
    </Row>
  </div>
);
