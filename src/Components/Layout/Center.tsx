import * as React from 'react';
import { Omit } from '../../types';
import { FlexProps, Flex } from '.';

type CenterProps = Omit<
  FlexProps,
  'direction' | 'justifyContent' | 'alignItems'
>;

export const Center: React.SFC<CenterProps> = props => {
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      direction="column"
      {...props}
    />
  );
};
