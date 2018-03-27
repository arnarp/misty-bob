import * as React from 'react'
import * as classNames from 'classnames'
import './Row.css'
import { ReactNode } from 'react'

interface RowProps {
  children: ReactNode
  spacing?: 'Medium'
  justifyContent?: 'Start' | 'End' | 'SpaceBetween' | 'Center'
  alignItems?: 'Center'
  growChildren?: boolean
  wrap?: boolean
  breakPoint?: '610'
}

export const Row = (props: RowProps) => (
  <div
    className={classNames(
      'Row',
      props.spacing ? `Spacing-${props.spacing}` : '',
      {
        JustifyContentStart: props.justifyContent === 'Start',
        JustifyContentEnd: props.justifyContent === 'End',
        JustifyContentSpaceBetween: props.justifyContent === 'SpaceBetween',
        JustifyContentCenter: props.justifyContent === 'Center',
        AlignItemsCenter: props.alignItems === 'Center',
        GrowChildren: props.growChildren,
        Wrap: props.wrap,
        Break610: props.breakPoint === '610',
      },
    )}
  >
    {props.children}
  </div>
)
