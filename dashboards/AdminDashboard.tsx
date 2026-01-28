
import React, { useRef, useEffect, useState } from 'react';
import { User, AuditEntry } from '../types';
import { 
  BarChart3, 
  Settings, 
  Terminal, 
  Shield, 
  Scale, 
  Target, 
  CircleDollarSign, 
  FileText,
  ChevronDown,
  Download,
  ArrowDownCircle,
  CheckCircle2,
  Users,
  Plus
} from 'lucide-react';

interface Props {
  user: User;
  auditLogs: AuditEntry[];
}

const DEPARTMENTS = ['Technical', 'Sales', 'Marketing', 'Admin', 'Purchasing'] as const;
type DeptType = typeof DEPARTMENTS[number];

const MOCK_USERS_BY_DEPT: Record<DeptType, string[]> = {
  'Technical': ['TECH_NODE_01', 'TECH_NODE_02', 'TECH_NODE_03', 'TECH_NODE_04'],
  'Sales': ['SLS_UNIT_A', 'SLS_UNIT_B', 'SLS_UNIT_C'],
  'Marketing': ['MKT_CORE_X', 'MKT_CORE_Y'],
  'Admin': ['SYS_ADM_ROOT', 'SYS_ADM_02'],
  'Purchasing': ['PUR_LOG_01', 'PUR_LOG_02', 'PUR_LOG_03']
};

const AdminDashboard: React.FC<Props> = ({ user, auditLogs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [showExportSuccess, setShowExportSuccess] = useState(false);
  
  // User Management State
  const [activeDept, setActiveDept] = useState<DeptType>('Technical');
  const [modifyingUser, setModifyingUser] = useState<string | null>(null);

  // Auto-scroll logic for Audit Trail
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [auditLogs, isAtBottom]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const bottomThreshold = 50;
    setIsAtBottom(scrollHeight - scrollTop - clientHeight < bottomThreshold);
  };

  const handleExportPDF = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setShowExportSuccess(true);
      setTimeout(() => setShowExportSuccess(false), 3000);
    }, 1500);
  };

  const handleModifyUser = (userName: string) => {
    setModifyingUser(userName);
    // Simulate modification notification
    setShowExportSuccess(true); // Reusing notification UI for feedback
    setTimeout(() => setModifyingUser(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in duration-700">
      
      {/* Dynamic Feedback Toast */}
      {showExportSuccess && (
        <div className="fixed top-24 right-8 z-[100] animate-in slide-in-from-right-full fade-in duration-500">
          <div className="bg-[#0b1222] text-white px-6 py-4 rounded-[1.5rem] shadow-2xl border border-emerald-500/30 flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest leading-none mb-1">
                {modifyingUser ? 'Access Initialized' : 'Export Complete'}
              </p>
              <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-tighter">
                {modifyingUser ? `Modifying personnel: ${modifyingUser}` : 'ISO Audit PDF has been generated'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-[#2563eb] text-white text-[10px] font-black uppercase tracking-widest rounded-md">3P CERTIFIED SYSTEM</span>
            <span className="px-3 py-1 bg-[#0f172a] text-white text-[10px] font-black uppercase tracking-widest rounded-md">LEVEL: ADMIN</span>
          </div>
          <div>
            <h1 className="text-[40px] font-black text-[#1e293b] tracking-tight leading-none transition-colors">Global Systems Console</h1>
            <p className="text-slate-500 text-sm mt-2 font-medium transition-colors">Personnel: <span className="text-blue-600 font-bold">{user.name}</span> • Status: <span className="text-[#1e293b] font-bold">Active Connection</span></p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-5 min-w-[220px]">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
              <Scale className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">BASE SALARY</p>
              <p className="text-2xl font-black text-[#1e293b] tracking-tight transition-colors">${user.baseSalary.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-[#f0f7ff] p-6 rounded-[2.5rem] border border-[#dbeafe] shadow-sm flex items-center gap-5 min-w-[220px]">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-[#dbeafe]">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">TARGET INCENTIVE</p>
              <p className="text-2xl font-black text-[#1e293b] tracking-tight transition-colors">${user.incentiveTarget.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Validated Objectives Section */}
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
                { label: "GLOBAL UPTIME", value: "99.8", unit: "%" },
                { label: "SECURITY PATCH LATENCY", value: "99.8", unit: "H" },
                { label: "THREAT NEUTRALIZATION", value: "99.8", unit: "%" }
              ].map((metric, i) => (
                <div key={i} className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{metric.label}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-[#1e293b] tracking-tighter transition-colors">{metric.value}</span>
                    <span className="text-xs font-bold text-slate-400 uppercase transition-colors">{metric.unit}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${parseFloat(metric.value)}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Enhanced User Management Section */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 flex flex-col h-[500px]">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center shadow-sm">
                    <Settings className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-[11px] font-black text-[#1e293b] uppercase tracking-[0.1em]">USER MANAGEMENT</h3>
                </div>
                <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Department Tabs Switcher */}
              <div className="flex overflow-x-auto gap-2 pb-6 custom-scrollbar-thin scroll-smooth no-scrollbar">
                {DEPARTMENTS.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setActiveDept(dept)}
                    className={`whitespace-nowrap px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                      activeDept === dept 
                        ? 'bg-[#2563eb] text-white shadow-lg shadow-blue-200' 
                        : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
              
              <div className="flex-grow space-y-4 overflow-y-auto pr-1 custom-scrollbar-thin">
                {MOCK_USERS_BY_DEPT[activeDept].map((sysUser, i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-slate-50/40 rounded-2xl border border-slate-100 hover:border-blue-100 transition-all hover:bg-white hover:shadow-md group">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                          <Users className="w-5 h-5 text-slate-300 group-hover:text-blue-400 transition-colors" />
                        </div>
                        {i % 2 === 0 && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
                        )}
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-[#1e293b] block tracking-wider transition-colors">{sysUser}</span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">NODE STATUS: ACTIVE</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleModifyUser(sysUser)}
                      className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors"
                    >
                      MODIFY
                    </button>
                  </div>
                ))}
                
                {/* Empty State visual */}
                <div className="py-8 text-center border border-dashed border-slate-100 rounded-2xl bg-slate-50/20">
                  <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">End of {activeDept} directory</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-50">
                <button className="w-full py-3 bg-[#0f172a] text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-blue-400" />
                  PROVISION NEW {activeDept.toUpperCase()} NODE
                </button>
              </div>
            </div>

            {/* ISO COMPLIANT SYSTEM ROOT AUDIT */}
            <div className="bg-[#0f172a] rounded-[2.5rem] p-10 shadow-xl border border-slate-800 text-white flex flex-col h-[500px] relative">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <Terminal className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">ISO AUDIT TRAIL</h3>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleExportPDF}
                    disabled={isExporting}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-[8px] font-black text-blue-400 uppercase tracking-widest hover:bg-blue-500/20 transition-all disabled:opacity-50"
                  >
                    {isExporting ? (
                      <span className="animate-pulse">GENERATING...</span>
                    ) : (
                      <>
                        <Download className="w-3 h-3" />
                        PDF COPY
                      </>
                    )}
                  </button>
                  <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-[8px] font-black text-emerald-400 uppercase tracking-widest">LIVE</span>
                </div>
              </div>
              
              <div 
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex-grow space-y-4 font-mono text-[9px] overflow-y-auto pr-2 custom-scrollbar-thin scroll-smooth"
              >
                {auditLogs.length === 0 ? (
                  <div className="text-slate-600 italic">Initializing secure audit logging...</div>
                ) : (
                  auditLogs.map((log) => (
                    <div key={log.id} className="border-l-2 border-slate-800 pl-4 py-1 space-y-1 hover:bg-white/5 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className={`${log.type === 'OK' ? 'text-emerald-400' : log.type === 'WARN' ? 'text-amber-400' : 'text-blue-400'} font-black`}>
                          [{log.type}] {log.action}
                        </span>
                        <span className="text-slate-500 text-[8px]">{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <div className="text-slate-400 flex items-center gap-2">
                         <span className="text-[8px] px-1 bg-slate-800 rounded text-slate-500 uppercase font-black">{log.user}</span>
                         <span>{log.details}</span>
                      </div>
                    </div>
                  ))
                )}
                <div className="h-4"></div>
              </div>

              {/* Jump to bottom button */}
              {!isAtBottom && (
                <button 
                  onClick={scrollToBottom}
                  className="absolute bottom-16 right-10 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-500 transition-all animate-bounce"
                >
                  <ArrowDownCircle className="w-5 h-5" />
                </button>
              )}

              <div className="mt-6 flex items-center gap-2 border-t border-slate-800 pt-4">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-slate-600 text-[8px] font-black uppercase tracking-widest">End of stream</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar area */}
        <div className="lg:col-span-4 space-y-8">
          {/* P3 Realization Card */}
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
                  <span className="text-6xl font-black tracking-tighter">1.00</span>
                  <span className="text-blue-500 text-2xl font-black italic">x</span>
                </div>
              </div>
              <div className="space-y-5">
                <div className="flex justify-between items-end">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">PROJECTED YIELD</p>
                  <p className="text-3xl font-black text-[#10b981] tracking-tight">$24,965.998</p>
                </div>
                <div className="h-1.5 bg-slate-800/50 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full shadow-[0_0_12px_rgba(37,99,235,0.5)]" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* System Security section */}
          <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-8">SYSTEM SECURITY</p>
            <div className="flex items-center gap-5 p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
                <Shield className="w-6 h-6 text-blue-600/40" />
              </div>
              <div>
                <h4 className="text-[11px] font-black text-[#1e293b] uppercase tracking-widest mb-1.5 transition-colors">SUPERVISOR AUDIT</h4>
                <p className="text-[9px] font-bold text-slate-400 leading-relaxed uppercase tracking-tighter transition-colors">Updates only commit after hierarchical verification.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar-thin::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
        }
        .custom-scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(30, 41, 59, 1);
          border-radius: 10px;
        }
        .custom-scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(51, 65, 85, 1);
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
