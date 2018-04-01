export type MainColors =
  | 'default'
  | 'white'
  | 'primary'
  | 'secondary'
  | 'Error'
  | 'Green';
export type Sizes = 'Small' | 'Medium' | 'Large' | 'XLarge';

export type IconProps = {
  color?: MainColors;
  size?: Sizes;
  className?: string;
};
