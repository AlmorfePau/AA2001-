
import React from 'react';
import { User, UserRole, Transmission, SystemStats } from '../types';
import EmployeeDashboard from '../dashboards/EmployeeDashboard';
import SupervisorDashboard from '../dashboards/SupervisorDashboard';
import DeptHeadDashboard from '../dashboards/DeptHeadDashboard';
import AdminDashboard from '../dashboards/AdminDashboard';
import ExecutiveDashboard from '../dashboards/ExecutiveDashboard';

interface DashboardProps {
  user: User;
  pendingTransmissions: Transmission[];
  validatedStats: Record<string, SystemStats>;
  onTransmit: (t: Transmission) => void;
  onValidate: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  user, 
  pendingTransmissions, 
  validatedStats, 
  onTransmit, 
  onValidate 
}) => {
  switch (user.role) {
    case UserRole.EMPLOYEE:
      return (
        <EmployeeDashboard 
          user={user} 
          validatedStats={validatedStats[user.id]} 
          onTransmit={onTransmit} 
        />
      );
    case UserRole.SUPERVISOR:
      return (
        <SupervisorDashboard 
          user={user} 
          pendingTransmissions={pendingTransmissions} 
          onValidate={onValidate} 
        />
      );
    case UserRole.DEPT_HEAD:
      return <DeptHeadDashboard user={user} />;
    case UserRole.ADMIN:
      return <AdminDashboard user={user} />;
    case UserRole.EXECUTIVE:
      return <ExecutiveDashboard user={user} />;
    default:
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-black text-slate-900 uppercase">Unauthorized Access</h1>
            <p className="text-slate-400 font-medium">Role profile not recognized by the security grid.</p>
          </div>
        </div>
      );
  }
};

export default Dashboard;