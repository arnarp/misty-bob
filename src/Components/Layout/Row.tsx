import * as React from 'react';
import { Omit } from '../../types';
import { FlexProps, Flex } from '.';

type RowProps = Omit<FlexProps, 'direction'>;

export const Row: React.SFC<RowProps> = props => {
  return <Flex direction="row" {...props} />;
};
