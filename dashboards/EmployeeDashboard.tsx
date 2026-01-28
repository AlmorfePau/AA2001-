
import React, { useState, useEffect, useMemo } from 'react';
import { User, Transmission, SystemStats } from '../types';
import { 
  BarChart3, 
  RefreshCw, 
  Zap, 
  Shield, 
  ArrowRight, 
  Scale, 
  Target,
  CircleCheck,
  History,
  Activity,
  CheckCircle2,
  Clock,
  Database
} from 'lucide-react';

interface Props {
  user: User;
  validatedStats?: SystemStats;
  onTransmit: (t: Transmission) => void;
}

interface TransmissionRecord {
  id: string;
  timestamp: string;
  responseTime: string;
  accuracy: string;
  uptime: string;
}

const EmployeeDashboard: React.FC<Props> = ({ user, validatedStats, onTransmit }) => {
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  
  const [matrixInputs, setMatrixInputs] = useState({
    responseTime: '',
    accuracy: '',
    uptime: ''
  });

  const [transmissionHistory, setTransmissionHistory] = useState<TransmissionRecord[]>(() => {
    const saved = localStorage.getItem(`aa2001_history_${user.id}`);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(`aa2001_history_${user.id}`, JSON.stringify(transmissionHistory));
  }, [transmissionHistory, user.id]);

  const isFormInvalid = !matrixInputs.responseTime.trim() || 
                        !matrixInputs.accuracy.trim() || 
                        !matrixInputs.uptime.trim();

  const handleInputChange = (field: keyof typeof matrixInputs, value: string) => {
    setMatrixInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleTransmission = () => {
    if (isFormInvalid) return;

    setIsTransmitting(true);
    setTimeout(() => {
      const transmissionId = Math.random().toString(36).substr(2, 6).toUpperCase();
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      const newRecord: TransmissionRecord = {
        id: transmissionId,
        timestamp: timestamp,
        responseTime: matrixInputs.responseTime,
        accuracy: matrixInputs.accuracy,
        uptime: matrixInputs.uptime,
      };

      setTransmissionHistory(prev => [newRecord, ...prev].slice(0, 5));
      
      onTransmit({
        ...newRecord,
        userId: user.id,
        userName: user.name
      });

      setMatrixInputs({
        responseTime: '',
        accuracy: '',
        uptime: ''
      });

      setIsTransmitting(false);
      setShowNotification(true);
    }, 2000);
  };

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => setShowNotification(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  // Derived metrics from validated data
  const metrics = useMemo(() => [
    { label: "AVG RESPONSE TIME", value: validatedStats?.responseTime || '0', unit: "MS", percent: validatedStats ? Math.max(0, Math.min((300 / parseFloat(validatedStats.responseTime)) * 100, 100)) : 0 },
    { label: "LOG ACCURACY", value: validatedStats?.accuracy || '0', unit: "%", percent: validatedStats ? parseFloat(validatedStats.accuracy) : 0 },
    { label: "NODE UPTIME", value: validatedStats?.uptime || '0', unit: "%", percent: validatedStats ? parseFloat(validatedStats.uptime) : 0 }
  ], [validatedStats]);

  // Calculate real yield based on validated stats
  const realization = useMemo(() => {
    if (!validatedStats) return { multiplier: '0.00', yield: '0.00', progress: '0%' };
    
    const acc = parseFloat(validatedStats.accuracy) / 100;
    const upt = parseFloat(validatedStats.uptime) / 100;
    const mult = (acc * upt).toFixed(2);
    const projected = (user.incentiveTarget * parseFloat(mult)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 3 });
    const progress = (parseFloat(mult) * 100).toFixed(1) + '%';
    
    return { multiplier: mult, yield: projected, progress };
  }, [validatedStats, user.incentiveTarget]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in duration-700 relative">
      
      {showNotification && (
        <div className="fixed top-24 right-8 z-[100] animate-in slide-in-from-right-full fade-in duration-500">
          <div className="bg-[#0b1222] text-white px-6 py-4 rounded-[1.5rem] shadow-2xl border border-blue-500/30 flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest leading-none mb-1">Transmission Sent</p>
              <p className="text-[9px] font-bold text-blue-400 uppercase tracking-tighter">Awaiting Supervisor Validation</p>
            </div>
          </div>
        </div>
      )}

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
        <div className="lg:col-span-8 space-y-8">
          
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
              {metrics.map((metric, i) => (
                <div key={i} className="space-y-4">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{metric.label}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-900 tracking-tighter">{metric.value}</span>
                    <span className="text-xs font-bold text-slate-400 uppercase">{metric.unit}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full transition-all duration-1000" style={{ width: `${metric.percent}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

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
                 <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">VALIDATED SYSTEM SCORE: <span className="text-blue-700">{validatedStats ? '100%' : '0%'}</span></p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {[
                { id: "responseTime", label: "AVG RESPONSE TIME", value: matrixInputs.responseTime, unit: "MS", target: "TARGET: <300MS", weight: "WEIGHT: 40%", placeholder: "Enter MS" },
                { id: "accuracy", label: "LOG ACCURACY", value: matrixInputs.accuracy, unit: "%", target: "TARGET: 98%", weight: "WEIGHT: 30%", placeholder: "Enter %" },
                { id: "uptime", label: "NODE UPTIME", value: matrixInputs.uptime, unit: "%", target: "TARGET: 99.9%", weight: "WEIGHT: 30%", placeholder: "Enter %" }
              ].map((input, i) => (
                <div key={i} className="bg-slate-50/50 rounded-[2rem] p-6 border border-slate-100/50 space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{input.label}</p>
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-100 rounded-full text-[8px] font-black text-blue-600 uppercase">
                      <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                      INPUT
                    </span>
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center justify-between shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                    <input 
                      type="text"
                      placeholder={input.placeholder}
                      className="text-xl font-black text-slate-900 bg-transparent outline-none w-full placeholder:text-slate-200 placeholder:font-normal"
                      value={input.value}
                      onChange={(e) => handleInputChange(input.id as keyof typeof matrixInputs, e.target.value)}
                    />
                    <span className="text-[10px] font-bold text-slate-300 uppercase">{input.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-[8px] font-black text-slate-300 uppercase">{input.target}</p>
                    <p className="text-[8px] font-black text-blue-400 uppercase">{input.weight}</p>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={handleTransmission}
              disabled={isTransmitting || isFormInvalid}
              className={`w-full py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all active:scale-[0.99] shadow-xl shadow-slate-200 ${
                isTransmitting || isFormInvalid 
                  ? 'bg-slate-300 cursor-not-allowed opacity-60' 
                  : 'bg-[#0b1222] hover:bg-slate-800'
              } text-white`}
            >
              {isTransmitting ? (
                <>
                  TRANSMITTING...
                  <Activity className="w-4 h-4 animate-spin" />
                </>
              ) : (
                <>
                  ESTABLISH TRANSMISSION
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center shadow-sm">
                <History className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">RECENT NODE UPDATES</h3>
            </div>
            
            {transmissionHistory.length === 0 ? (
              <div className="space-y-4 flex flex-col items-center justify-center py-12 bg-slate-50/20 rounded-[2rem] border border-dashed border-slate-200">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">No recent node activity detected</p>
              </div>
            ) : (
              <div className="space-y-4">
                {transmissionHistory.map((record) => (
                  <div key={record.id} className="bg-slate-50/50 p-6 rounded-[1.5rem] border border-slate-100/50 flex items-center justify-between group hover:bg-white hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:border-blue-100 transition-colors">
                        <Database className="w-4 h-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">NODE_UPDT_{record.id}</p>
                        <div className="flex items-center gap-2 text-[9px] text-slate-400 font-bold uppercase">
                          <Clock className="w-3 h-3" />
                          {record.timestamp}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-8">
                       <div className="text-center">
                          <p className="text-[8px] font-black text-slate-300 uppercase mb-0.5">RESP</p>
                          <p className="text-[10px] font-black text-slate-700">{record.responseTime}ms</p>
                       </div>
                       <div className="text-center">
                          <p className="text-[8px] font-black text-slate-300 uppercase mb-0.5">ACC</p>
                          <p className="text-[10px] font-black text-slate-700">{record.accuracy}%</p>
                       </div>
                       <div className="text-center">
                          <p className="text-[8px] font-black text-slate-300 uppercase mb-0.5">UPTIME</p>
                          <p className="text-[10px] font-black text-slate-700">{record.uptime}%</p>
                       </div>
                       <div className="flex items-center px-4">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
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
                  <span className="text-6xl font-black tracking-tighter">{realization.multiplier}</span>
                  <span className="text-blue-500 text-2xl font-black italic">x</span>
                </div>
              </div>
              <div className="space-y-5">
                <div className="flex justify-between items-end">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">PROJECTED YIELD</p>
                  <p className="text-3xl font-black text-emerald-400 tracking-tight">${realization.yield}</p>
                </div>
                <div className="h-1.5 bg-slate-800/50 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full shadow-[0_0_12px_rgba(37,99,235,0.5)] transition-all duration-1000" style={{ width: realization.progress }}></div>
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
