
import React from 'react';
import { User } from '../types';
// Fixed the error by removing 'Input' which is not exported by 'lucide-react' and removing unused 'Database' icon.
import { 
  BarChart3, 
  RefreshCw, 
  Zap, 
  Shield, 
  ArrowRight, 
  Scale, 
  Target,
  CircleCheck,
  History
} from 'lucide-react';

interface Props {
  user: User;
}

const EmployeeDashboard: React.FC<Props> = ({ user }) => {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-md">SP CERTIFIED SYSTEM</span>
            <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-md">LEVEL: EMPLOYEE</span>
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">System Performance Console</h1>
            <p className="text-slate-500 text-sm mt-2 font-medium">Personnel: <span className="text-blue-600 font-bold">{user.name}</span> • Status: <span className="text-blue-500 font-bold italic">Active Connection</span></p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-5 min-w-[220px]">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
              <Scale className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">BASE SALARY</p>
              <p className="text-2xl font-black text-slate-900 tracking-tight">${user.baseSalary.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[2.5rem] border border-blue-100 shadow-sm flex items-center gap-5 min-w-[220px] bg-blue-50/20">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">TARGET INCENTIVE</p>
              <p className="text-2xl font-black text-slate-900 tracking-tight">${user.incentiveTarget.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Console Content */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Validated Objectives Section */}
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">VALIDATED OBJECTIVES</h3>
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">VERIFIED PERFORMANCE LEVELS</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { label: "AVG RESPONSE TIME", value: "285", unit: "MS", percent: 85 },
                { label: "LOG ACCURACY", value: "97.5", unit: "%", percent: 97.5 },
                { label: "NODE UPTIME", value: "99.8", unit: "%", percent: 99.8 }
              ].map((metric, i) => (
                <div key={i} className="space-y-4">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{metric.label}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-900 tracking-tighter">{metric.value}</span>
                    <span className="text-xs font-bold text-slate-400 uppercase">{metric.unit}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${metric.percent}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Data Transmission Matrix Section */}
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                  <RefreshCw className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">DATA TRANSMISSION MATRIX</h3>
                  <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">UPDATE PERFORMANCE LOGS</p>
                </div>
              </div>
              <div className="px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl">
                 <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">VALIDATED SYSTEM SCORE: <span className="text-blue-700">99.8%</span></p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {[
                { label: "AVG RESPONSE TIME", value: "285", unit: "MS", target: "TARGET: <300MS", weight: "WEIGHT: 40%" },
                { label: "LOG ACCURACY", value: "97.5", unit: "%", target: "TARGET: 98%", weight: "WEIGHT: 30%" },
                { label: "NODE UPTIME", value: "99.8", unit: "%", target: "TARGET: 99.9%", weight: "WEIGHT: 30%" }
              ].map((input, i) => (
                <div key={i} className="bg-slate-50/50 rounded-[2rem] p-6 border border-slate-100/50 space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{input.label}</p>
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-100 rounded-full text-[8px] font-black text-blue-600 uppercase">
                      <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                      INPUT
                    </span>
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center justify-between shadow-sm">
                    <span className="text-xl font-black text-slate-900">{input.value}</span>
                    <span className="text-[10px] font-bold text-slate-300 uppercase">{input.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-[8px] font-black text-slate-300 uppercase">{input.target}</p>
                    <p className="text-[8px] font-black text-blue-400 uppercase">{input.weight}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full py-5 bg-[#0b1222] text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-slate-800 transition-all active:scale-[0.99] shadow-xl shadow-slate-200">
              ESTABLISH TRANSMISSION
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Recent Node Updates Section */}
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center shadow-sm">
                <History className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">RECENT NODE UPDATES</h3>
            </div>
            <div className="space-y-4">
              {[
                { id: "2401", time: "2024-05-18 09:42", hash: "6a2...f3b" },
                { id: "2402", time: "2024-05-17 14:15", hash: "1eb...a9q" }
              ].map((log, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-slate-50/40 rounded-[2rem] border border-slate-100 hover:bg-white transition-all">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm">
                      <CircleCheck className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest">AUDIT LOG #{log.id}</p>
                      <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">{log.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-black text-slate-300 mb-1">{log.hash}</p>
                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">VERIFIED</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* P3 Realization Card */}
          <div className="bg-[#0b1222] rounded-[3rem] p-10 shadow-2xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 blur-[100px] rounded-full -mr-24 -mt-24"></div>
            
            <div className="flex items-center gap-4 mb-16">
              <div className="w-11 h-11 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/40">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.1em]">P3 REALIZATION</h3>
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">VALIDATED PAYOUT</p>
              </div>
            </div>

            <div className="space-y-16">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">VALIDATED MULTIPLIER</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black tracking-tighter">1.00</span>
                  <span className="text-blue-500 text-2xl font-black italic">x</span>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex justify-between items-end">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">PROJECTED YIELD</p>
                  <p className="text-3xl font-black text-emerald-400 tracking-tight">$11,978.029</p>
                </div>
                <div className="h-1.5 bg-slate-800/50 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full shadow-[0_0_12px_rgba(37,99,235,0.5)]" style={{ width: '99.8%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* System Security Section */}
          <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-8">SYSTEM SECURITY</p>
            <div className="flex items-center gap-5 p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
                <Shield className="w-6 h-6 text-blue-600/40" />
              </div>
              <div>
                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-1.5">SUPERVISOR AUDIT</h4>
                <p className="text-[9px] font-bold text-slate-400 leading-relaxed uppercase tracking-tighter">Updates only commit after hierarchical verification.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
