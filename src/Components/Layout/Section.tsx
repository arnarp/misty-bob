import * as React from 'react';
import { Flex, FlexProps } from '../../Components/Layout';
import { Omit } from '../../types';

type SectionProps = Omit<FlexProps, 'as' | 'direction'> & {
  direction?: 'row' | 'column';
};

export const Section: React.SFC<SectionProps> = props => {
  const { direction, ...rest } = props;
  return (
    <Flex as="section" direction={direction || 'column'} {...rest}>
      {props.children}
    </Flex>
  );
};
