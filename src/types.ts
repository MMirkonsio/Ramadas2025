export interface Schedule {
  id: string;
  name: string;
  time: string;
  remainingTime: number;
}

export interface User {
  role: 'admin' | 'employee';
  isAuthenticated: boolean;
}

export interface AdminCredentials {
  username: string;
  password: string;
}