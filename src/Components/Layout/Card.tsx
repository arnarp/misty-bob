import * as React from 'react'
import './Card.css'
import * as classNames from 'classnames'

interface CardProps {
  children: React.ReactNode
  className?: string
}

export const Card = (props: CardProps) => (
  <div className={classNames('Card', props.className)}>{props.children}</div>
)

export const CardContent = (props: CardProps) => (
  <div className={classNames('CardContent', props.className)}>
    {props.children}
  </div>
)
