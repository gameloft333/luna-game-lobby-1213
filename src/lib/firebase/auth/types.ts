import { User } from 'firebase/auth';

export interface AuthResult {
  user: User | null;
  error: string | null;
}

export interface SignOutResult {
  error: string | null;
}