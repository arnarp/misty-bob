import * as React from 'react';
import * as classNames from 'classnames';
import './Col.css';

type ColProps = {
  spacing?: 'medium' | 'large';
  seperators?: boolean;
  justifyContent?: 'start' | 'end' | 'spaceBetween' | 'center';
  className?: string;
  as?: string;
};

export const Col: React.SFC<ColProps> = ({
  as,
  spacing,
  justifyContent,
  className,
  children,
  seperators,
}) => {
  const As = as || 'div';
  return (
    <As
      className={classNames(
        'Col',
        spacing ? `Spacing-${spacing}` : '',
        {
          JustifyContentStart: justifyContent === 'start',
          JustifyContentEnd: justifyContent === 'end',
          JustifyContentSpaceBetween: justifyContent === 'spaceBetween',
          JustifyContentCenter: justifyContent === 'center',
          Seperators: seperators,
        },
        className,
      )}
    >
      {children}
    </As>
  );
};
