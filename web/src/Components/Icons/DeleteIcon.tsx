import * as React from 'react'
import { IconProps } from './IconProps'
import './icons.css'
import * as classNames from 'classnames'

export const DeleteIcon = (props: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    className={classNames(
      'Svg',
      `Fill-${props.color}`,
      `Size-${props.size}`,
      props.className,
    )}
  >
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </svg>
)
