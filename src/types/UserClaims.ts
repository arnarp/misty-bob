export type UserClaims = {
  role?: UserRole[];
  username?: string;
};
export type UserRole = 'admin' | 'test';
