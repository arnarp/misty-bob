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
  maxWidth?: 'medium';
  seperators?: boolean;
  growChildren?: boolean;
  as?: string;
  grow?: boolean;
  className?: string;
  role?: 'banner' | 'radiogroup';
};

export const Flex: React.SFC<FlexProps> = ({
  direction,
  justifyContent,
  alignItems,
  wrap,
  sidePaddings,
  spacing,
  maxWidth,
  seperators,
  growChildren,
  as,
  grow,
  className,
  role,
  children,
}) => {
  const As = as || 'div';
  return (
    <As
      role={role}
      className={classNames(
        'Flex',
        spacing ? `Spacing-${spacing}` : '',
        sidePaddings ? `SidePaddings-${sidePaddings}` : '',
        justifyContent ? `JustifyContent-${justifyContent}` : '',
        alignItems ? `AlignItems-${alignItems}` : '',
        maxWidth ? `MaxWidth-${maxWidth}` : '',
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
