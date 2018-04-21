import * as React from 'react';
import * as classNames from 'classnames';
import './Flex.css';

export type FlexProps = {
  direction: 'row' | 'column';
  justifyContent?: 'start' | 'center' | 'end' | 'spaceBetween';
  alignItems?: 'center';
  wrap?: boolean;
  sidePaddings?: 'medium' | 'mediumResponsive';
  spacing?: 'large' | 'medium' | 'small';
  seperators?: boolean;
  growChildren?: boolean;
  as?: string;
  grow?: boolean;
  className?: string;
};

export const Flex: React.SFC<FlexProps> = ({
  direction,
  justifyContent,
  alignItems,
  wrap,
  sidePaddings,
  spacing,
  seperators,
  growChildren,
  as,
  grow,
  className,
  children,
}) => {
  const As = as || 'div';
  return (
    <As
      className={classNames(
        'Flex',
        spacing ? `Spacing-${spacing}` : '',
        sidePaddings ? `SidePaddings-${sidePaddings}` : '',
        justifyContent ? `JustifyContent-${justifyContent}` : '',
        alignItems ? `AlignItems-${alignItems}` : '',
        {
          GrowChildren: growChildren,
          Wrap: wrap,
          Grow: grow,
          [direction]: true,
          Seperators: seperators,
        },
        className,
      )}
    >
      {children}
    </As>
  );
};
