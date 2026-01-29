
import React, { useState, useEffect, useMemo } from 'react';
import { User, Transmission, SystemStats } from '../types';
import { 
  BarChart3, 
  Target, 
  Zap, 
  Shield, 
  Scale, 
  CircleDollarSign,
  Send,
  Activity,
  CheckCircle2
} from 'lucide-react';

interface Props {
  user: User;
  validatedStats?: SystemStats;
  onTransmit: (t: Transmission) => void;
}

const EmployeeDashboard: React.FC<Props> = ({ user, validatedStats, onTransmit }) => {
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Simulated metrics based on validated stats or defaults
  const metrics = useMemo(() => {
    return {
      responseTime: validatedStats?.responseTime || "342ms",
      accuracy: validatedStats?.accuracy || "98.2%",
      uptime: validatedStats?.uptime || "99.9%"
    };
  }, [validatedStats]);

  const handleTransmit = () => {
    setIsTransmitting(true);
    
    // Simulate system delay
    setTimeout(() => {
      const transmission: Transmission = {
        id: Math.random().toString(36).substr(2, 9).toUpperCase(),
        userId: user.id,
        userName: user.name,
        timestamp: new Date().toISOString(),
        responseTime: (Math.random() * 200 + 100).toFixed(0) + "ms",
        accuracy: (Math.random() * 5 + 95).toFixed(1) + "%",
        uptime: "100%"
      };
      
      onTransmit(transmission);
      setIsTransmitting(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in duration-700">
      
      {/* Toast Notification */}
      {showSuccess && (
        <div className="fixed top-24 right-8 z-[100] animate-in slide-in-from-right-full fade-in duration-500">
          <div className="bg-[#0b1222] text-white px-6 py-4 rounded-[1.5rem] shadow-2xl border border-emerald-500/30 flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest leading-none mb-1">DATA BROADCAST</p>
              <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-tighter">Transmission Successful</p>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-[#2563eb] text-white text-[10px] font-black uppercase tracking-widest rounded-md">3P CERTIFIED SYSTEM</span>
            <span className="px-3 py-1 bg-[#0f172a] text-white text-[10px] font-black uppercase tracking-widest rounded-md">LEVEL: EMPLOYEE</span>
            {user.department && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-md border border-blue-200">
                DEPT: {user.department}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-[40px] font-black text-[#1e293b] tracking-tight leading-none">Personal Performance Console</h1>
            <p className="text-slate-500 text-sm mt-2 font-medium">
              Personnel: <span className="text-blue-600 font-bold">{user.name}</span> • 
              Status: <span className="text-[#1e293b] font-bold">Active Connection</span>
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-5 min-w-[220px]">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
              <Scale className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">BASE SALARY</p>
              <p className="text-2xl font-black text-[#1e293b] tracking-tight">${user.baseSalary.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-[#f0f7ff] p-6 rounded-[2.5rem] border border-[#dbeafe] shadow-sm flex items-center gap-5 min-w-[220px]">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-[#dbeafe]">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">TARGET INCENTIVE</p>
              <p className="text-2xl font-black text-[#1e293b] tracking-tight">${user.incentiveTarget.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          
          {/* Performance Overview */}
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#1e293b] uppercase tracking-widest leading-none mb-1">VALIDATED OBJECTIVES</h3>
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">VERIFIED PERFORMANCE LEVELS</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { label: "RESPONSE TIME", value: metrics.responseTime, unit: "", progress: 85 },
                { label: "PRECISION ACCURACY", value: metrics.accuracy, unit: "", progress: 98 },
                { label: "NODE UPTIME", value: metrics.uptime, unit: "", progress: 100 }
              ].map((metric, i) => (
                <div key={i} className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{metric.label}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-[#1e293b] tracking-tighter">{metric.value}</span>
                    <span className="text-xs font-bold text-slate-400 uppercase">{metric.unit}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${metric.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Center Center */}
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
             <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-4 text-center md:text-left">
                   <h3 className="text-2xl font-black text-[#1e293b] tracking-tight">Broadcast Current Session</h3>
                   <p className="text-slate-400 text-sm font-medium max-w-sm">
                      Establish a secure data transmission to the validation queue for Supervisor review.
                   </p>
                </div>
                <button 
                  onClick={handleTransmit}
                  disabled={isTransmitting}
                  className={`px-10 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-4 shadow-xl active:scale-95 ${
                    isTransmitting 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
                    : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/10'
                  }`}
                >
                  {isTransmitting ? (
                    <>
                      <Activity className="w-5 h-5 animate-spin" />
                      Transmitting...
                    </>
                  ) : (
                    <>
                      Initiate Broadcast
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
             </div>
          </div>
        </div>

        {/* Sidebar area */}
        <div className="lg:col-span-4 space-y-8">
          
          <div className="bg-[#0b1222] rounded-[3rem] p-10 shadow-2xl text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 blur-[100px] rounded-full -mr-24 -mt-24"></div>
            
            <div className="flex items-center gap-4 mb-16">
              <div className="w-11 h-11 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/40">
                <CircleDollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.1em] leading-none mb-1">P3 REALIZATION</h3>
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">VALIDATED PAYOUT</p>
              </div>
            </div>

            <div className="space-y-16">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">VALIDATED MULTIPLIER</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black tracking-tighter">0.85</span>
                  <span className="text-blue-500 text-2xl font-black italic">x</span>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex justify-between items-end">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">PROJECTED YIELD</p>
                  <p className="text-3xl font-black text-[#10b981] tracking-tight">$10,200.0</p>
                </div>
                <div className="h-1.5 bg-slate-800/50 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full shadow-[0_0_12px_rgba(37,99,235,0.5)]" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-8">SYSTEM SECURITY</p>
            <div className="flex items-center gap-5 p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
                <Shield className="w-6 h-6 text-blue-600/40" />
              </div>
              <div>
                <h4 className="text-[11px] font-black text-[#1e293b] uppercase tracking-widest mb-1.5">SUPERVISOR AUDIT</h4>
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
