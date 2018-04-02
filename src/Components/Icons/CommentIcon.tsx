import * as React from 'react';
import * as classNames from 'classnames';
import './icons.css';
import { IconProps } from './IconProps';

export const CommentIcon = (props: IconProps) => (
  <svg
    viewBox="0 0 64 64"
    className={classNames(
      'Svg',
      `Stroke-${props.color}`,
      `Size-${props.size}`,
      props.className,
    )}
  >
    <path
      d="M5 59l18.8-6.9a37.1 37.1 0 0 0 8.2.9c16.6 0 30-10.7 30-24S48.6 5 32 5 2 15.7 2 29c0 6.7 3.5 12.8 9.1 17.2z"
      fill="none"
      strokeMiterlimit="10"
      strokeWidth="2"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </svg>
);
