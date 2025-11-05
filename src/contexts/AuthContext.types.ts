import { ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthProviderProps {
  children: ReactNode;
}
