
import React from 'react';
import { User } from '../types';
import { Target, Activity, Layers, Terminal, ArrowRight } from 'lucide-react';

interface Props {
  user: User;
}

const DeptHeadDashboard: React.FC<Props> = ({ user }) => {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Departmental Strategy Hub</h1>
          <p className="text-slate-500 text-xs font-bold mt-1 tracking-widest uppercase">
            Head of Operations • {user.name}
          </p>
        </div>
        <div className="flex items-center gap-8">
           <div className="text-right">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fiscal Target</p>
             <p className="text-xl font-black text-slate-900">${(user.baseSalary + user.incentiveTarget).toLocaleString()}</p>
           </div>
           <div className="w-px h-10 bg-slate-100"></div>
           <div className="text-right">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Score Index</p>
             <p className="text-xl font-black text-blue-600">89.2%</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'BUDGET UTILIZATION', value: 95.2, unit: '%', target: 96 },
          { label: 'STRATEGIC ALIGNMENT', value: 88, unit: '%', target: 90 },
          { label: 'RISK MITIGATION', value: 98.5, unit: '%', target: 99 },
        ].map(metric => (
          <div key={metric.label} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:border-blue-200 transition-all group">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{metric.label}</span>
              <Activity className="w-4 h-4 text-slate-300 group-hover:text-blue-500" />
            </div>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-black text-slate-900 tracking-tighter">{metric.value}</span>
              <span className="text-sm font-black text-slate-400">{metric.unit}</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(metric.value / metric.target) * 100}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeptHeadDashboard;
