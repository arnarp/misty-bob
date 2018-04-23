import * as React from 'react';
import { Omit } from '../../types';
import { FlexProps, Flex } from '.';

type ColProps = Omit<FlexProps, 'direction'>;

export const Col: React.SFC<ColProps> = props => {
  return <Flex direction="column" {...props} />;
};
