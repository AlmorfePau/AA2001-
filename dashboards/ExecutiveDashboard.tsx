
import React from 'react';
import { User } from '../types';
import { TrendingUp, Globe, Briefcase, Zap } from 'lucide-react';

interface Props {
  user: User;
}

const ExecutiveDashboard: React.FC<Props> = ({ user }) => {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="bg-white rounded-[2.5rem] p-12 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-12">
           <div>
             <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Strategic Growth Board</h1>
             <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Chief Executive Officer • {user.name}</p>
           </div>
           <div className="flex gap-4">
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Comp</p>
                <p className="text-3xl font-black text-slate-900">${(user.baseSalary + user.incentiveTarget).toLocaleString()}</p>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="p-8 bg-blue-600 rounded-[2rem] text-white">
             <TrendingUp className="w-8 h-8 mb-6" />
             <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-2">Revenue Growth</p>
             <p className="text-4xl font-black">14.2%</p>
           </div>
           <div className="p-8 bg-slate-900 rounded-[2rem] text-white">
             <Briefcase className="w-8 h-8 mb-6 text-blue-500" />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Net Margin</p>
             <p className="text-4xl font-black">23.5%</p>
           </div>
           <div className="p-8 bg-emerald-500 rounded-[2rem] text-white">
             <Globe className="w-8 h-8 mb-6" />
             <p className="text-[10px] font-black text-emerald-100 uppercase tracking-widest mb-2">Market Expansion</p>
             <p className="text-4xl font-black">4 Nodes</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveDashboard;
