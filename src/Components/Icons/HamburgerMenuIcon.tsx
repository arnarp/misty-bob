import * as React from 'react'
import { IconProps } from './IconProps'
import * as classNames from 'classnames'

export const HamburgerMenuIcon = (props: IconProps) => (
  <svg
    className={classNames(
      'Svg',
      `Fill-${props.color}`,
      `Size-${props.size}`,
      props.className,
    )}
    viewBox="0 0 24 24"
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path
      d={`
      M3 18
      h18
      v-2
      H3
      v2
      z

      m0-5
      h18
      v-2
      H3
      v2
      z

      m0-7
      v2
      h18
      V6
      H3
      z
      `}
    />
  </svg>
)
