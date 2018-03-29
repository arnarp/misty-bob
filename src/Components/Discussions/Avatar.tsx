import * as React from 'react';

type AvatarProps = {
  photoURL: string;
};

export const Avatar: React.SFC<AvatarProps> = props => (
  <img
    src={props.photoURL}
    style={{
      height: '36px',
      width: '36px',
      borderRadius: '50%',
    }}
  />
);
