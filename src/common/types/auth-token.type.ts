import { AuthMode } from './auth-mode.type';
import { Role } from './role.type';

export type AuthToken = {
  _id: string;
  email: string;
  role: Role;
  authMode: AuthMode;
};
