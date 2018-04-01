import * as React from 'react';
import * as classNames from 'classnames';
import './Col.css';

type ColProps = {
  spacing?: 'medium' | 'large';
  justifyContent?: 'Start' | 'End' | 'SpaceBetween' | 'Center';
  className?: string;
  as?: string;
};

export const Col: React.SFC<ColProps> = ({
  as,
  spacing,
  justifyContent,
  className,
  children,
}) => {
  const As = as || 'div';
  return (
    <As
      className={classNames(
        'Col',
        spacing ? `Spacing-${spacing}` : '',
        {
          JustifyContentStart: justifyContent === 'Start',
          JustifyContentEnd: justifyContent === 'End',
          JustifyContentSpaceBetween: justifyContent === 'SpaceBetween',
          JustifyContentCenter: justifyContent === 'Center',
        },
        className,
      )}
    >
      {children}
    </As>
  );
};
