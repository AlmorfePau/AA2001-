
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

export interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  type: 'INFO' | 'OK' | 'WARN';
}

export interface SystemNotification {
  id: string;
  targetUserId: string;
  message: string;
  timestamp: string;
  type: 'INFO' | 'SUCCESS' | 'ALERT';
}

export interface Announcement {
  id: string;
  department: string;
  senderName: string;
  message: string;
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  baseSalary: number;
  incentiveTarget: number;
  department?: string;
}

export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
}
