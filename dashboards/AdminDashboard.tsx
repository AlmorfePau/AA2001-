
import React from 'react';
import { User } from '../types';
import { Server, Shield, Zap, Database } from 'lucide-react';

interface Props {
  user: User;
}

const AdminDashboard: React.FC<Props> = ({ user }) => {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="bg-slate-900 rounded-[2.5rem] p-12 shadow-xl border border-slate-800 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase">Infrastructure Command</h1>
          <p className="text-blue-400 text-xs font-bold mt-1 tracking-widest uppercase">
            Systems Administrator • {user.name}
          </p>
        </div>
        <div className="bg-blue-600 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
          Root Access Established
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'GLOBAL UPTIME', value: 99.99, unit: '%', icon: Server },
          { label: 'THREAT LATENCY', value: 48, unit: 'MS', icon: Shield },
          { label: 'NODE INTEGRITY', value: 100, unit: '%', icon: Database },
        ].map(metric => (
          <div key={metric.label} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
            <metric.icon className="w-8 h-8 text-blue-600 mb-6" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{metric.label}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900 tracking-tighter">{metric.value}</span>
              <span className="text-xs font-bold text-slate-400">{metric.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
