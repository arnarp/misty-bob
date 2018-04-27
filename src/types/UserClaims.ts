export type UserClaims = {
  role?: UserRole[];
  uName?: string;
};
export type UserRole = 'admin' | 'test';
