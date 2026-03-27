export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'customer' | 'admin';
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  name: string;
  phone: string;
  password: string;
}

export interface AuthToken {
  userId: string;
  role: 'customer' | 'admin';
  exp: number;
}
