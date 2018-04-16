import * as React from 'react';
import { IconProps } from './IconProps';
import * as classNames from 'classnames';
import './icons.css';

export const LikeIcon = (props: IconProps) => (
  <svg
    className={classNames(
      'Svg',
      `Stroke-${props.color}`,
      `Size-${props.size}`,
      props.className,
    )}
    viewBox="0 0 64 64"
  >
    <path
      d="M54 35h2a4 4 0 1 0 0-8H34a81 81 0 0 0 2-18 4 4 0 0 0-8 0s-4 22-18 22H4v24h10c4 0 12 4 16 4h20a4 4 0 0 0 0-8h2a4 4 0 0 0 0-8h2a4 4 0 0 0 0-8"
      fill="none"
      strokeMiterlimit="10"
      strokeWidth="2"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </svg>
);
