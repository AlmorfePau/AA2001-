export enum UserRole {
  EMPLOYEE = 'Employee',
  SUPERVISOR = 'Supervisor',
  DEPT_HEAD = 'Department Head',
  ADMIN = 'Admin',
  EXECUTIVE = 'Executive'
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