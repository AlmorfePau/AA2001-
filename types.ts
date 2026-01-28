
export enum UserRole {
  EMPLOYEE = 'Employee',
  SUPERVISOR = 'Supervisor',
  DEPT_HEAD = 'Department Head',
  ADMIN = 'Admin',
  EXECUTIVE = 'Executive'
}

export interface SystemStats {
  responseTime: string;
  accuracy: string;
  uptime: string;
}

export interface Transmission extends SystemStats {
  id: string;
  userId: string;
  userName: string;
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  baseSalary: number;
  incentiveTarget: number;
}

export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
}