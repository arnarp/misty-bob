import * as React from 'react';
import * as classNames from 'classnames';
import './Row.css';

type RowProps = {
  spacing?: 'Medium';
  justifyContent?: 'Start' | 'End' | 'SpaceBetween';
  alignItems?: 'Center';
  growChildren?: boolean;
  wrap?: boolean;
  breakPoint?: '610';
  as?: string;
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
}) => {
  const As = as || 'div';
  return (
    <As
      className={classNames('Row', spacing ? `Spacing-${spacing}` : '', {
        JustifyContentStart: justifyContent === 'Start',
        JustifyContentEnd: justifyContent === 'End',
        JustifyContentSpaceBetween: justifyContent === 'SpaceBetween',
        AlignItemsCenter: alignItems === 'Center',
        GrowChildren: growChildren,
        Wrap: wrap,
        Break610: breakPoint === '610',
      })}
    >
      {children}
    </As>
  );
};
