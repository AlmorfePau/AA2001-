
import React, { useState } from 'react';
import { User, Transmission, SystemStats } from '../types';
import { 
  BarChart3, 
  Users, 
  Target, 
  FileText, 
  Shield, 
  Scale,
  CircleDollarSign,
  CheckCircle2,
  Edit2,
  X
} from 'lucide-react';

interface Props {
  user: User;
  pendingTransmissions: Transmission[];
  onValidate: (id: string, overrides?: SystemStats) => void;
}

const SupervisorDashboard: React.FC<Props> = ({ user, pendingTransmissions, onValidate }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [overrides, setOverrides] = useState<SystemStats | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const startOverride = (transmission: Transmission) => {
    setEditingId(transmission.id);
    setOverrides({
      responseTime: transmission.responseTime,
      accuracy: transmission.accuracy,
      uptime: transmission.uptime
    });
  };

  const cancelOverride = () => {
    setEditingId(null);
    setOverrides(null);
  };

  const handleOverrideChange = (field: keyof SystemStats, value: string) => {
    if (overrides) {
      setOverrides({ ...overrides, [field]: value });
    }
  };

  const confirmValidation = (id: string) => {
    const isOverride = !!overrides;
    onValidate(id, overrides || undefined);
    
    // Trigger feedback notification
    setFeedbackMsg(isOverride ? 'Manual override applied and validated' : 'Standard entry validated successfully');
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 3000);

    setEditingId(null);
    setOverrides(null);
  };

  // Set to empty to satisfy "empty at the beginning" requirement
  const staticMocks: any[] = [];

  const allEntries = [
    ...pendingTransmissions.map(t => ({
      id: t.id,
      name: t.userName,
      role: "PERSONNEL",
      score: "PENDING",
      stats: { RESP: t.responseTime, ACC: t.accuracy, UPTIME: t.uptime },
      status: "PENDING",
      color: "text-amber-500 bg-amber-50",
      active: true,
      real: true,
      fullData: t
    })),
    ...staticMocks.map(m => ({ ...m, real: false, id: Math.random().toString(), fullData: null }))
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in duration-700 relative">
      
      {/* Feedback Toast Notification */}
      {showFeedback && (
        <div className="fixed top-24 right-8 z-[100] animate-in slide-in-from-right-full fade-in duration-500">
          <div className="bg-[#0b1222] text-white px-6 py-4 rounded-[1.5rem] shadow-2xl border border-emerald-500/30 flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest leading-none mb-1">Operation Success</p>
              <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-tighter">{feedbackMsg}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-[#2563eb] text-white text-[10px] font-black uppercase tracking-widest rounded-md">3P CERTIFIED SYSTEM</span>
            <span className="px-3 py-1 bg-[#0f172a] text-white text-[10px] font-black uppercase tracking-widest rounded-md">LEVEL: SUPERVISOR</span>
            {user.department && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-md border border-blue-200">
                DEPT: {user.department}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-[40px] font-black text-[#1e293b] tracking-tight leading-none">Unit Performance Console</h1>
            <p className="text-slate-500 text-sm mt-2 font-medium">Personnel: <span className="text-blue-600 font-bold">{user.name}</span> • Status: <span className="text-[#1e293b] font-bold">Active Connection</span></p>
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
                { label: "TEAM COMPLIANCE", value: "98", unit: "%" },
                { label: "INCIDENT RESOLUTION", value: "99.8", unit: "M" },
                { label: "VALIDATION THROUGHPUT", value: "99.8", unit: "L" }
              ].map((metric, i) => (
                <div key={i} className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{metric.label}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-[#1e293b] tracking-tighter">{metric.value}</span>
                    <span className="text-xs font-bold text-slate-400 uppercase">{metric.unit}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${parseFloat(metric.value)}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#1e293b] uppercase tracking-widest leading-none mb-1">TEAM VALIDATION QUEUE</h3>
                  <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">PENDING APPROVALS</p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-[#f0f7ff] text-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-colors border border-[#dbeafe]">
                <FileText className="w-3.5 h-3.5" />
                GENERATE UNIT REPORT
              </button>
            </div>

            <div className="space-y-4">
              {allEntries.length === 0 ? (
                <div className="py-20 text-center space-y-4 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-100">
                   <Users className="w-8 h-8 text-slate-100 mx-auto" />
                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Validation queue is empty</p>
                   <p className="text-[8px] font-bold text-slate-200 uppercase tracking-tighter">Awaiting node transmissions from personnel</p>
                </div>
              ) : (
                allEntries.map((person: any) => (
                  <div key={person.id} className={`flex items-center justify-between p-5 bg-slate-50/40 rounded-[2rem] hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100 group ${person.real ? 'ring-2 ring-blue-500/10' : ''}`}>
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-3xl bg-white border border-slate-100 flex items-center justify-center text-xs font-black text-blue-600 shadow-sm uppercase">
                        <span className="text-[#34d399]">{person.name.split(' ').map((n: string) => n[0]).join('')}</span>
                      </div>
                      <div>
                        <p className="text-xs font-black text-[#1e293b]">{person.name} {person.active && <span className="w-2 h-2 bg-amber-400 rounded-full inline-block ml-1"></span>}</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-loose">{person.role} • SCORE: {person.score}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-8">
                      <div className="hidden md:flex gap-8">
                        {Object.entries(person.stats).map(([k, v]) => (
                          <div key={k} className="text-center min-w-[50px]">
                            <p className="text-[8px] font-black text-slate-300 uppercase mb-1">{k}</p>
                            {editingId === person.id && overrides ? (
                              <input 
                                type="text" 
                                className="text-[10px] font-black text-blue-600 bg-white border border-blue-200 rounded w-12 text-center outline-none"
                                value={k === 'RESP' ? overrides.responseTime : k === 'ACC' ? overrides.accuracy : overrides.uptime}
                                onChange={(e) => handleOverrideChange(k === 'RESP' ? 'responseTime' : k === 'ACC' ? 'accuracy' : 'uptime', e.target.value)}
                              />
                            ) : (
                              <p className="text-[10px] font-black text-slate-700">{v as React.ReactNode}</p>
                            )}
                          </div>
                        ))}
                      </div>

                      {person.real && (
                        <div className="flex items-center gap-2">
                          {editingId === person.id ? (
                            <>
                              <button 
                                onClick={cancelOverride}
                                className="p-2 rounded-lg bg-slate-100 text-slate-400 hover:text-slate-600 transition-all"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => confirmValidation(person.id!)}
                                className="p-2.5 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-200 hover:scale-110 transition-all flex items-center gap-2"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                <span className="text-[8px] font-black uppercase tracking-widest">COMMIT</span>
                              </button>
                            </>
                          ) : (
                            <>
                              <button 
                                onClick={() => person.fullData && startOverride(person.fullData)}
                                className="p-2 rounded-xl text-slate-300 hover:text-blue-500 hover:bg-blue-50 transition-all"
                                title="Override Entry"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => confirmValidation(person.id!)}
                                className="p-2.5 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-200 hover:scale-110 transition-all flex items-center gap-2 group/btn"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                <span className="text-[8px] font-black uppercase tracking-widest hidden group-hover/btn:block">VALIDATE</span>
                              </button>
                            </>
                          )}
                        </div>
                      )}

                      {!person.real && (
                        <span className={`px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${person.color}`}>
                          {person.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

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
                  <span className="text-6xl font-black tracking-tighter">0.89</span>
                  <span className="text-blue-500 text-2xl font-black italic">x</span>
                </div>
              </div>
              <div className="space-y-5">
                <div className="flex justify-between items-end">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">PROJECTED YIELD</p>
                  <p className="text-3xl font-black text-[#10b981] tracking-tight">$16,016.4</p>
                </div>
                <div className="h-1.5 bg-slate-800/50 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full shadow-[0_0_12px_rgba(37,99,235,0.5)]" style={{ width: '89%' }}></div>
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

export default SupervisorDashboard;
