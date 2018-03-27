export type MainColors =
  | 'Default'
  | 'White'
  | 'Primary'
  | 'Secondary'
  | 'Error'
  | 'Green';
export type Sizes = 'Small' | 'Medium' | 'Large' | 'XLarge';

export type IconProps = {
  color?: MainColors;
  size?: Sizes;
  className?: string;
};
