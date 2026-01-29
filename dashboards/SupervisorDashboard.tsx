
import React, { useState, useMemo } from 'react';
import { User, Transmission, SystemStats, Announcement } from '../types';
import { 
  BarChart3, 
  Users, 
  FileText, 
  Shield, 
  CheckCircle2, 
  Edit2, 
  X, 
  LayoutDashboard, 
  ListTodo, 
  ClipboardCheck, 
  History,
  AlertTriangle,
  ArrowRight,
  Eye,
  RotateCcw,
  Megaphone,
  Send,
  Clock,
  Trash2
} from 'lucide-react';

interface Props {
  user: User;
  pendingTransmissions: Transmission[];
  announcements: Announcement[];
  onValidate: (id: string, overrides?: SystemStats) => void;
  onAddAuditEntry: (action: string, details: string, type?: 'INFO' | 'OK' | 'WARN', userName?: string) => void;
  onPostAnnouncement: (message: string) => void;
  onDeleteAnnouncement: (id: string) => void;
}

type Page = 'dashboard' | 'queue' | 'validation' | 'reports';

const SupervisorDashboard: React.FC<Props> = ({ 
  user, 
  pendingTransmissions, 
  announcements,
  onValidate, 
  onAddAuditEntry,
  onPostAnnouncement,
  onDeleteAnnouncement
}) => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [selectedItem, setSelectedItem] = useState<Transmission | null>(null);
  const [reviewFlaggedOnly, setReviewFlaggedOnly] = useState(false);
  const [announcementMsg, setAnnouncementMsg] = useState('');
  
  // Validation/Override State
  const [overrides, setOverrides] = useState<SystemStats | null>(null);
  const [overrideReason, setOverrideReason] = useState('');

  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // 30 Days expiration logic
  const activeAnnouncements = useMemo(() => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    return announcements
      .filter(a => a.department === user.department)
      .filter(a => new Date(a.timestamp) > oneMonthAgo)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [announcements, user.department]);

  // Simulation: Flagging logic (e.g., response time > 250ms or accuracy < 97%)
  const isFlagged = (t: Transmission) => {
    const rt = parseInt(t.responseTime);
    const acc = parseFloat(t.accuracy);
    return rt > 250 || acc < 97;
  };

  const filteredQueue = useMemo(() => {
    if (reviewFlaggedOnly) {
      return pendingTransmissions.filter(isFlagged);
    }
    return pendingTransmissions;
  }, [pendingTransmissions, reviewFlaggedOnly]);

  const handleOpenValidation = (item: Transmission) => {
    setSelectedItem(item);
    setOverrides({
      responseTime: item.responseTime,
      accuracy: item.accuracy,
      uptime: item.uptime
    });
    setOverrideReason('');
    setCurrentPage('validation');
  };

  const handleDispatchAnnouncement = () => {
    if (!announcementMsg.trim()) return;
    onPostAnnouncement(announcementMsg);
    setAnnouncementMsg('');
    setFeedbackMsg(`Broadcast dispatched to ${user.department} unit.`);
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 3000);
  };

  const handleDeleteBroadcast = (id: string) => {
    if (window.confirm("ARE YOU SURE YOU WANT TO REMOVE THIS BROADCAST? PERSONNEL WILL NO LONGER SEE THIS DIRECTIVE.")) {
      onDeleteAnnouncement(id);
      setFeedbackMsg(`Broadcast removed from active queue.`);
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 3000);
    }
  };

  const handleAction = (type: 'APPROVE' | 'REJECT' | 'OVERRIDE') => {
    if (!selectedItem) return;

    if (type === 'OVERRIDE' && !overrideReason.trim()) {
      alert("MANDATORY: Provide a reason for score override.");
      return;
    }

    if (type === 'REJECT') {
      onAddAuditEntry('KPI_REJECTED', `Supervisor ${user.name} rejected submission ${selectedItem.id} from ${selectedItem.userName}. Reasoning: ${overrideReason || 'Not specified'}`, 'WARN');
      onValidate(selectedItem.id); 
      setFeedbackMsg(`Submission ${selectedItem.id} rejected.`);
    } else if (type === 'OVERRIDE') {
      onAddAuditEntry('KPI_OVERRIDE', `Manual override by ${user.name} for ${selectedItem.userName}. Reason: ${overrideReason}`, 'OK');
      onValidate(selectedItem.id, overrides || undefined);
      setFeedbackMsg(`Override committed for ${selectedItem.userName}.`);
    } else {
      onAddAuditEntry('KPI_APPROVED', `Standard approval by ${user.name} for submission ${selectedItem.id}`, 'OK');
      onValidate(selectedItem.id);
      setFeedbackMsg(`Submission validated for ${selectedItem.userName}.`);
    }

    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 3000);
    setCurrentPage('queue');
    setSelectedItem(null);
  };

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Total Pending</p>
          <div className="flex items-end justify-between">
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter">{pendingTransmissions.length}</h2>
            <ListTodo className="w-8 h-8 text-blue-100" />
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Flagged Items</p>
          <div className="flex items-end justify-between">
            <h2 className="text-5xl font-black text-amber-500 tracking-tighter">{pendingTransmissions.filter(isFlagged).length}</h2>
            <AlertTriangle className="w-8 h-8 text-amber-100" />
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Avg. Validation</p>
          <div className="flex items-end justify-between">
            <h2 className="text-5xl font-black text-emerald-500 tracking-tighter">12m</h2>
            <RotateCcw className="w-8 h-8 text-emerald-100" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 flex flex-col gap-8">
          <div className="bg-[#0b1222] rounded-[2.5rem] p-10 text-white relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full -mr-32 -mt-32"></div>
            <div className="relative z-10 space-y-4">
              <h3 className="text-2xl font-black tracking-tight">System Integrity Directive</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">
                You are operating in <span className="text-blue-400 font-bold uppercase tracking-widest text-[10px]">Bias-Free Control Mode</span>. 
                Financial metrics and personal objectives have been obscured to ensure objective validation of operational data.
              </p>
            </div>
            <button 
              onClick={() => setCurrentPage('queue')}
              className="mt-8 relative z-10 w-fit px-8 py-4 bg-white text-slate-900 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-blue-50 transition-all shadow-xl shadow-blue-500/10"
            >
              Go to Queue
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Group Announcement Feature */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Megaphone className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Department Broadcast</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Unit Message</p>
              </div>
            </div>
            <div className="space-y-4">
              <textarea 
                value={announcementMsg}
                onChange={(e) => setAnnouncementMsg(e.target.value)}
                placeholder={`Write an announcement for ${user.department} employees...`}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-sm font-medium text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all min-h-[120px] placeholder:text-slate-300"
              />
              <div className="flex flex-col gap-4">
                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest italic">
                  * Message expires after 30 days
                </p>
                <button 
                  onClick={handleDispatchAnnouncement}
                  disabled={!announcementMsg.trim()}
                  className={`flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 ${
                    announcementMsg.trim() 
                    ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/10' 
                    : 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none'
                  }`}
                >
                  Dispatch Broadcast
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm h-full flex flex-col">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                <History className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Active Unit Broadcasts</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Your Sent History ({activeAnnouncements.length})</p>
              </div>
            </div>

            <div className="flex-grow space-y-4 overflow-y-auto pr-2 custom-scrollbar max-h-[600px]">
              {activeAnnouncements.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30 py-20">
                  <Megaphone className="w-12 h-12 text-slate-300" />
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">No Active Broadcasts Found</p>
                </div>
              ) : (
                activeAnnouncements.map((a) => (
                  <div key={a.id} className="p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100 group transition-all hover:bg-white hover:shadow-md relative">
                    <button 
                      onClick={() => handleDeleteBroadcast(a.id)}
                      className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      title="Remove Broadcast"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <p className="text-sm font-medium text-slate-700 leading-relaxed mb-4 pr-8">"{a.message}"</p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          <Clock className="w-3 h-3" />
                          {new Date(a.timestamp).toLocaleDateString()}
                        </div>
                        <div className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-black uppercase tracking-widest rounded border border-blue-100">
                          Active
                        </div>
                      </div>
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                        Node: {a.id.substring(0, 8)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderQueue = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <ListTodo className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Submissions Queue</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Operational Validation Required</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div 
              onClick={() => setReviewFlaggedOnly(!reviewFlaggedOnly)}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${reviewFlaggedOnly ? 'bg-amber-500' : 'bg-slate-200'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${reviewFlaggedOnly ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-900 transition-colors">Review Flagged Only</span>
          </label>
        </div>
      </div>

      <div className="space-y-3">
        {filteredQueue.length === 0 ? (
          <div className="py-24 text-center space-y-4 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
            <ClipboardCheck className="w-12 h-12 text-slate-200 mx-auto" />
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Queue Clean • All Nodes Validated</p>
          </div>
        ) : (
          filteredQueue.map((item) => {
            const flagged = isFlagged(item);
            return (
              <div 
                key={item.id} 
                className={`group flex items-center justify-between p-6 bg-white rounded-[2rem] border transition-all hover:shadow-md ${flagged ? 'border-amber-100 hover:border-amber-200 bg-amber-50/10' : 'border-slate-50 hover:border-slate-200'}`}
              >
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xs uppercase shadow-sm ${flagged ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'}`}>
                    {item.userName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-black text-slate-900">{item.userName}</p>
                      {flagged && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-600 text-[8px] font-black uppercase tracking-widest rounded-md border border-amber-100">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          FLAGGED
                        </span>
                      )}
                    </div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">TRANSMISSION ID: {item.id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-12">
                  <div className="hidden lg:flex gap-8">
                    <div className="text-center">
                      <p className="text-[8px] font-black text-slate-300 uppercase mb-1">Response</p>
                      <p className="text-[10px] font-black text-slate-700">{item.responseTime}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[8px] font-black text-slate-300 uppercase mb-1">Accuracy</p>
                      <p className="text-[10px] font-black text-slate-700">{item.accuracy}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[8px] font-black text-slate-300 uppercase mb-1">Uptime</p>
                      <p className="text-[10px] font-black text-slate-700">{item.uptime}</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleOpenValidation(item)}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-slate-900/10 active:scale-95"
                  >
                    Validate
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  const renderValidation = () => {
    if (!selectedItem || !overrides) return null;
    const flagged = isFlagged(selectedItem);

    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-10 border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setCurrentPage('queue')}
                className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Validation Terminal</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Entry ID: {selectedItem.id}</p>
              </div>
            </div>
            {flagged && (
              <div className="px-4 py-2 bg-amber-50 text-amber-600 rounded-xl border border-amber-100 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Deviation Flagged</span>
              </div>
            )}
          </div>

          <div className="p-10 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Response Time</p>
                <div className="relative">
                  <input 
                    type="text" 
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-2xl font-black text-slate-900 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                    value={overrides.responseTime}
                    onChange={(e) => setOverrides({...overrides, responseTime: e.target.value})}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase">ms</div>
                </div>
                <p className="text-[9px] font-bold text-slate-300 uppercase">Original: {selectedItem.responseTime}</p>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accuracy</p>
                <div className="relative">
                  <input 
                    type="text" 
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-2xl font-black text-slate-900 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                    value={overrides.accuracy}
                    onChange={(e) => setOverrides({...overrides, accuracy: e.target.value})}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase">%</div>
                </div>
                <p className="text-[9px] font-bold text-slate-300 uppercase">Original: {selectedItem.accuracy}</p>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Uptime</p>
                <div className="relative">
                  <input 
                    type="text" 
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-2xl font-black text-slate-900 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                    value={overrides.uptime}
                    onChange={(e) => setOverrides({...overrides, uptime: e.target.value})}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase">%</div>
                </div>
                <p className="text-[9px] font-bold text-slate-300 uppercase">Original: {selectedItem.uptime}</p>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-50">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Override / Rejection Justification</p>
              <textarea 
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-sm font-medium text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all min-h-[120px] placeholder:text-slate-300"
                placeholder="Required for any modifications or rejections..."
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
              />
            </div>

            <div className="flex flex-col md:flex-row gap-4 pt-8">
              <button 
                onClick={() => handleAction('APPROVE')}
                className="flex-1 bg-emerald-600 text-white py-5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/10 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3"
              >
                <CheckCircle2 className="w-4 h-4" />
                Approve Standard
              </button>
              <button 
                onClick={() => handleAction('OVERRIDE')}
                className="flex-1 bg-blue-600 text-white py-5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/10 hover:bg-blue-700 transition-all flex items-center justify-center gap-3"
              >
                <Edit2 className="w-4 h-4" />
                Commit Override
              </button>
              <button 
                onClick={() => handleAction('REJECT')}
                className="flex-1 bg-slate-900 text-white py-5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-900/10 hover:bg-red-600 transition-all flex items-center justify-center gap-3"
              >
                <X className="w-4 h-4" />
                Reject Entry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderReports = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <History className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Audit & Reports</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Department Operational History</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-black text-slate-900">Integrity Index</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Validation Success Rate</p>
            </div>
            <p className="text-3xl font-black text-blue-600">99.4%</p>
          </div>
          <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-black text-slate-900">Pending Latency</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg. Time in Queue</p>
            </div>
            <p className="text-3xl font-black text-amber-500">14m</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 pb-12">
      {/* Toast feedback */}
      {showFeedback && (
        <div className="fixed top-24 right-8 z-[100] animate-in slide-in-from-right-full fade-in duration-500">
          <div className="bg-[#0b1222] text-white px-6 py-4 rounded-[1.5rem] shadow-2xl border border-emerald-500/30 flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest leading-none mb-1">Update Dispatched</p>
              <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-tighter">{feedbackMsg}</p>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 shrink-0 space-y-2">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
          <div className="pb-6 border-b border-slate-50">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">Management Console</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white text-xs">
                {user.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-black text-slate-900 truncate">{user.name}</p>
                <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1">
                  Supervisor 
                  <span className="text-slate-300 mx-0.5">•</span> 
                  <span className="truncate">{user.department}</span>
                </p>
              </div>
            </div>
          </div>

          <nav className="space-y-1">
            <button 
              onClick={() => setCurrentPage('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${currentPage === 'dashboard' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Team Dashboard
            </button>
            <button 
              onClick={() => setCurrentPage('queue')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${currentPage === 'queue' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <div className="flex items-center gap-3">
                <ListTodo className="w-4 h-4" />
                KPI Queue
              </div>
              {pendingTransmissions.length > 0 && (
                <span className="bg-blue-600 text-white px-1.5 py-0.5 rounded text-[8px]">{pendingTransmissions.length}</span>
              )}
            </button>
            <button 
              onClick={() => setCurrentPage('reports')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${currentPage === 'reports' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <FileText className="w-4 h-4" />
              Team Reports
            </button>
          </nav>
        </div>

        <div className="bg-slate-900 p-6 rounded-[2rem] text-white">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-4 h-4 text-blue-400" />
            <p className="text-[9px] font-black uppercase tracking-widest">Audit Mode</p>
          </div>
          <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-tighter">
            Actions are logged for {user.department} transparency records.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow">
        <header className="mb-8 space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
            {currentPage === 'dashboard' && 'Operational Overview'}
            {currentPage === 'queue' && 'Submissions Processing'}
            {currentPage === 'validation' && 'Control Terminal'}
            {currentPage === 'reports' && 'Strategic Analytics'}
          </h1>
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">
            {user.department} Unit Control
          </p>
        </header>

        {currentPage === 'dashboard' && renderDashboard()}
        {currentPage === 'queue' && renderQueue()}
        {currentPage === 'validation' && renderValidation()}
        {currentPage === 'reports' && renderReports()}
      </div>
    </div>
  );
};

export default SupervisorDashboard;
