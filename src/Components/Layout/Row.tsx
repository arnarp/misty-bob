import * as React from 'react';
import * as classNames from 'classnames';
import './Row.css';

type RowProps = {
  spacing?: 'medium' | 'small';
  justifyContent?: 'start' | 'end' | 'spaceBetween';
  alignItems?: 'center';
  growChildren?: boolean;
  wrap?: boolean;
  breakPoint?: '610';
  as?: string;
  grow?: boolean;
  className?: string;
  sidePaddings?: 'medium';
};

export const Row: React.SFC<RowProps> = ({
  spacing,
  justifyContent,
  alignItems,
  growChildren,
  wrap,
  breakPoint,
  children,
  as,
  grow,
  className,
  sidePaddings,
}) => {
  const As = as || 'div';
  return (
    <As
      className={classNames(
        'Row',
        spacing ? `Spacing-${spacing}` : '',
        sidePaddings ? `SidePaddings-${sidePaddings}` : '',
        {
          JustifyContentStart: justifyContent === 'start',
          JustifyContentEnd: justifyContent === 'end',
          JustifyContentSpaceBetween: justifyContent === 'spaceBetween',
          AlignItemsCenter: alignItems === 'center',
          GrowChildren: growChildren,
          Wrap: wrap,
          Break610: breakPoint === '610',
          Grow: grow,
        },
        className,
      )}
    >
      {children}
    </As>
  );
};
