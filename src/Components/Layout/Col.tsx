import * as React from 'react';
import { Omit } from '../../types';
import { FlexProps, Flex } from '.';

type RowProps = Omit<FlexProps, 'direction'>;

export const Col: React.SFC<RowProps> = props => {
  return <Flex direction="column" {...props} />;
};
