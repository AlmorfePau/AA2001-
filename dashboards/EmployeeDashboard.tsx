import React, { useState, useMemo } from 'react';
import { User, Transmission, SystemStats, Announcement } from '../types';
import { 
  Activity,
  CheckCircle2,
  Clock,
  Briefcase,
  MapPin,
  ClipboardList,
  HardHat,
  AlertTriangle,
  FileCheck,
  ChevronRight,
  Info,
  ChevronLeft,
  XCircle,
  FileText,
  ShieldCheck,
  Zap,
  CheckCircle,
  Wrench,
  Upload,
  Search,
  Shield
} from 'lucide-react';

interface Props {
  user: User;
  validatedStats?: SystemStats;
  announcements: Announcement[];
  onTransmit: (t: Transmission) => void;
}

const EmployeeDashboard: React.FC<Props> = ({ user, validatedStats, announcements, onTransmit }) => {
  const [activeStep, setActiveStep] = useState(1);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Factual Form State (Strictly objective data points)
  const [formData, setFormData] = useState({
    jobId: '',
    clientSite: '',
    jobType: 'Installation',
    startTime: '',
    endTime: '',
    systemStatus: 'Operational',
    pmPerformed: false,
    pmChecklist: {
      voltageChecked: false,
      connectivityVerified: false,
      firmwareUpdated: false,
      physicalInspection: false
    },
    docs: {
      jobReport: false,
      asBuilt: false,
      clientSignOff: false
    },
    safety: {
      incidentOccurred: false,
      ppeChecklist: true,
      riskAssessmentDone: true
    }
  });

  // 12 Technical KPIs (3Ps) - Read-Only, System-Calculated
  const kpiData = useMemo(() => [
    { 
      category: 'PEOPLE', 
      metrics: [
        { name: 'Technician Certification Rate', value: '100%', target: '≥ 95%', status: 'GOOD', desc: 'Sourced from HR / Training records' },
        { name: 'Rework Due to Human Error', value: '1.2%', target: '≤ 2%', status: 'GOOD', desc: 'Calculated via repeat job logic' },
        { name: 'Attendance & On-Time Rate', value: '99.1%', target: '≥ 98%', status: 'GOOD', desc: 'Centralized biometric logs' },
        { name: 'Safety Incident Rate', value: '0', target: '0', status: 'GOOD', desc: 'Field safety log verification' },
      ]
    },
    { 
      category: 'PROCESS', 
      metrics: [
        { name: 'Installation Completion Time', value: '96%', target: '≥ 95%', status: 'GOOD', desc: 'Job timestamp vs SLA' },
        { name: 'PM Compliance Rate', value: '98%', target: '≥ 98%', status: 'GOOD', desc: 'Verified preventive maintenance logs' },
        { name: 'First-Time Fix Rate', value: '92%', target: '≥ 90%', status: 'GOOD', desc: 'No return visits within 48h' },
        { name: 'Documentation Completion', value: '100%', target: '100%', status: 'GOOD', desc: 'File upload audit trails' },
      ]
    },
    { 
      category: 'PERFORMANCE', 
      metrics: [
        { name: 'System Downtime', value: 'SLA Met', target: '≤ SLA', status: 'GOOD', desc: 'Automated monitoring metrics' },
        { name: 'Client Technical Complaints', value: '0.4/mo', target: '≤ 2/mo', status: 'GOOD', desc: 'Ticketing system integration' },
        { name: 'Warranty Callbacks', value: '1.5%', target: '≤ 3%', status: 'GOOD', desc: 'Callback rate within 90 days' },
        { name: 'Maintenance Renewal Rate', value: '94%', target: '≥ 90%', status: 'GOOD', desc: 'AMC renewal contract data' },
      ]
    }
  ], []);

  const handleTransmit = () => {
    if (!formData.jobId || !formData.clientSite || !formData.startTime || !formData.endTime) {
      alert("MANDATORY: All job details including timestamps are required for ISO compliance.");
      return;
    }
    
    setIsTransmitting(true);
    
    const transmission: Transmission = {
      id: `TX-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      userId: user.id,
      userName: user.name,
      timestamp: new Date().toISOString(),
      responseTime: '312ms',
      accuracy: formData.docs.jobReport && formData.docs.asBuilt ? '100%' : '80%',
      uptime: formData.systemStatus === 'Operational' ? '100%' : '95%'
    };

    setTimeout(() => {
      onTransmit(transmission);
      setIsTransmitting(false);
      setShowSuccess(true);
      setActiveStep(1);
      setFormData({
        jobId: '',
        clientSite: '',
        jobType: 'Installation',
        startTime: '',
        endTime: '',
        systemStatus: 'Operational',
        pmPerformed: false,
        pmChecklist: { voltageChecked: false, connectivityVerified: false, firmwareUpdated: false, physicalInspection: false },
        docs: { jobReport: false, asBuilt: false, clientSignOff: false },
        safety: { incidentOccurred: false, ppeChecklist: true, riskAssessmentDone: true }
      });
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  const nextStep = () => setActiveStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setActiveStep(prev => Math.max(prev - 1, 1));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'GOOD': return 'text-emerald-500 bg-emerald-50 border-emerald-100';
      case 'WARN': return 'text-amber-500 bg-amber-50 border-amber-100';
      case 'FAIL': return 'text-rose-500 bg-rose-50 border-rose-100';
      default: return 'text-slate-500 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in duration-700">
      
      {/* Toast Success */}
      {showSuccess && (
        <div className="fixed top-24 right-8 z-[100] animate-in slide-in-from-right-full fade-in duration-500">
          <div className="bg-[#0b1222] text-white px-6 py-4 rounded-[1.5rem] shadow-2xl border border-emerald-500/30 flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest leading-none mb-1">Entry Transmitted</p>
              <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-tighter">System is calculating updated KPI scores...</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-md">TECHNICAL DEPT</span>
            <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-md italic">ISO-9001:2024</span>
          </div>
          <h1 className="text-[40px] font-black text-slate-900 tracking-tight leading-none uppercase">Service Terminal</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium italic">Bias-Proof Operational Input Mode</p>
        </div>

        <div className="flex gap-4">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 min-w-[200px]">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">CURRENT SHIFT</p>
              <p className="text-xl font-black text-slate-900 tracking-tight uppercase">08:00 - 17:00</p>
            </div>
          </div>
          <div className="bg-slate-900 p-6 rounded-[2rem] shadow-xl flex items-center gap-5 min-w-[200px] text-white">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">SECURITY STATUS</p>
              <p className="text-xl font-black text-blue-400 tracking-tight uppercase">ENCRYPTED</p>
            </div>
          </div>
        </div>
      </div>

      {/* Announcements Panel (Unit-specific directives) - MOVED ABOVE TERMINAL & SCORECARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12">
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Operational Directives</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Department Unit News</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {announcements.length === 0 ? (
                <div className="col-span-full py-20 text-center space-y-4 opacity-30">
                  <Info className="w-12 h-12 mx-auto text-slate-300" />
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">No active unit directives</p>
                </div>
              ) : (
                announcements.map((a) => (
                  <div key={a.id} className="p-6 bg-slate-50/50 border border-slate-100 rounded-[2rem] space-y-4 group hover:bg-white hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                      <div className="px-3 py-1 bg-blue-50 text-blue-600 text-[8px] font-black uppercase tracking-widest rounded-md border border-blue-100">
                        URGENT
                      </div>
                      <p className="text-[8px] font-black text-slate-300 uppercase">{new Date(a.timestamp).toLocaleDateString()}</p>
                    </div>
                    <p className="text-xs font-bold text-slate-700 leading-relaxed uppercase tracking-tight">"{a.message}"</p>
                    <div className="flex items-center gap-3 pt-2 border-t border-slate-100/50">
                      <div className="w-6 h-6 bg-slate-900 rounded-lg flex items-center justify-center text-[8px] font-black text-white">
                        {a.senderName.charAt(0)}
                      </div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{a.senderName}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Panel: Factual Input Terminal */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
            {/* Step Indicator */}
            <div className="bg-slate-50 p-6 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-4">
                {[1, 2, 3, 4].map(s => (
                  <div key={s} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs transition-all ${
                      activeStep === s ? 'bg-blue-600 text-white shadow-lg' : activeStep > s ? 'bg-emerald-500 text-white' : 'bg-white text-slate-300 border border-slate-200'
                    }`}>
                      {activeStep > s ? <CheckCircle className="w-4 h-4" /> : s}
                    </div>
                    {s < 4 && <div className={`w-4 h-px ${activeStep > s ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>}
                  </div>
                ))}
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Step {activeStep} of 4: {
                  activeStep === 1 ? 'Primary Job Data' :
                  activeStep === 2 ? 'Technical Confirmation' :
                  activeStep === 3 ? 'Document Verification' : 'Safety Compliance'
                }
              </p>
            </div>

            {/* Form Content */}
            <div className="flex-grow p-10 space-y-8 animate-in fade-in duration-300" key={activeStep}>
              {activeStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Job ID / Work Order</label>
                      <div className="relative">
                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input 
                          type="text" 
                          placeholder="WO-2024-XXXX"
                          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-sm text-black placeholder:text-slate-300"
                          value={formData.jobId}
                          onChange={e => setFormData({...formData, jobId: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Client / Site Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input 
                          type="text" 
                          placeholder="Main Facility - Manila"
                          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-sm text-black placeholder:text-slate-300"
                          value={formData.clientSite}
                          onChange={e => setFormData({...formData, clientSite: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Timestamp</label>
                      <input 
                        type="datetime-local" 
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-sm text-black"
                        value={formData.startTime}
                        onChange={e => setFormData({...formData, startTime: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">End Timestamp</label>
                      <input 
                        type="datetime-local" 
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-sm text-black"
                        value={formData.endTime}
                        onChange={e => setFormData({...formData, endTime: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Job Classification</label>
                    <select 
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-sm appearance-none text-black"
                      value={formData.jobType}
                      onChange={e => setFormData({...formData, jobType: e.target.value})}
                    >
                      <option className="text-black">Installation</option>
                      <option className="text-black">Preventive Maintenance</option>
                      <option className="text-black">Reactive Repair</option>
                      <option className="text-black">Emergency Response</option>
                      <option className="text-black">Site Survey</option>
                    </select>
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                <div className="space-y-8">
                  <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-3xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Wrench className="w-5 h-5 text-blue-600" />
                        <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Preventive Maintenance Checklist</p>
                      </div>
                      <button 
                        onClick={() => setFormData({...formData, pmPerformed: !formData.pmPerformed})}
                        className={`w-12 h-6 rounded-full transition-all p-1 ${formData.pmPerformed ? 'bg-blue-600' : 'bg-slate-200'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-all ${formData.pmPerformed ? 'translate-x-6' : ''}`}></div>
                      </button>
                    </div>

                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-opacity ${formData.pmPerformed ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                      {Object.entries(formData.pmChecklist).map(([key, value]) => (
                        <label key={key} className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            className="w-5 h-5 rounded border-slate-200 text-blue-600 focus:ring-blue-500"
                            checked={value}
                            onChange={(e) => setFormData({
                              ...formData, 
                              pmChecklist: { ...formData.pmChecklist, [key]: e.target.checked }
                            })}
                          />
                          <span className="text-xs font-bold text-slate-600 uppercase tracking-widest group-hover:text-slate-900 transition-colors">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">System Health Post-Job</p>
                    <div className="flex gap-4">
                      {['Operational', 'Degraded', 'Critical'].map(status => (
                        <button
                          key={status}
                          onClick={() => setFormData({...formData, systemStatus: status})}
                          className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                            formData.systemStatus === status 
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xl' 
                            : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 3 && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 gap-4">
                    {Object.entries(formData.docs).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-[1.5rem] group hover:bg-white hover:shadow-md transition-all">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${value ? 'bg-emerald-100 text-emerald-600' : 'bg-white border border-slate-200 text-slate-300'}`}>
                            {value ? <FileCheck className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
                          </div>
                          <div>
                            <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase">ISO MANDATORY ATTACHMENT</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setFormData({
                            ...formData,
                            docs: { ...formData.docs, [key]: !value }
                          })}
                          className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                            value ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'
                          }`}
                        >
                          {value ? 'VERIFIED' : 'MARK UPLOADED'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeStep === 4 && (
                <div className="space-y-8">
                  <div className="p-8 bg-rose-50 border border-rose-100 rounded-3xl space-y-6">
                    <div className="flex items-center gap-3">
                      <HardHat className="w-6 h-6 text-rose-600" />
                      <h3 className="text-sm font-black text-rose-900 uppercase tracking-widest">Mandatory Safety Declaration</h3>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-rose-100">
                        <div>
                          <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Safety Incident Occurred?</p>
                          <p className="text-[8px] font-bold text-slate-400 uppercase mt-0.5">Must match central safety log</p>
                        </div>
                        <button 
                          onClick={() => setFormData({...formData, safety: { ...formData.safety, incidentOccurred: !formData.safety.incidentOccurred }})}
                          className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            formData.safety.incidentOccurred ? 'bg-rose-600 text-white' : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {formData.safety.incidentOccurred ? 'YES (RECORDED)' : 'NO INCIDENT'}
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <label className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-rose-100 cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="w-5 h-5 rounded border-slate-200 text-rose-600" 
                            checked={formData.safety.ppeChecklist}
                            onChange={e => setFormData({...formData, safety: { ...formData.safety, ppeChecklist: e.target.checked }})}
                          />
                          <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">PPE COMPLIANT</span>
                        </label>
                        <label className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-rose-100 cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="w-5 h-5 rounded border-slate-200 text-rose-600" 
                            checked={formData.safety.riskAssessmentDone}
                            onChange={e => setFormData({...formData, safety: { ...formData.safety, riskAssessmentDone: e.target.checked }})}
                          />
                          <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">RISK ASSESSED</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-900 rounded-3xl flex items-center gap-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl -mr-16 -mt-16"></div>
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-6 h-6 text-amber-400" />
                    </div>
                    <p className="text-[10px] font-bold leading-relaxed uppercase tracking-widest opacity-80">
                      By submitting, I certify that the data provided is factual and reflects the actual work performed. False reporting will trigger an automatic ISO audit flag.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Navigation */}
            <div className="bg-slate-50 p-6 flex items-center justify-between border-t border-slate-100">
              <button 
                onClick={prevStep}
                disabled={activeStep === 1}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeStep === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              
              {activeStep < 4 ? (
                <button 
                  onClick={nextStep}
                  className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-900/10 hover:bg-slate-800 active:scale-95 transition-all"
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button 
                  onClick={handleTransmit}
                  disabled={isTransmitting}
                  className={`flex items-center gap-3 px-10 py-4 rounded-[1.2rem] text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl transition-all active:scale-95 ${
                    isTransmitting ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20'
                  }`}
                >
                  {isTransmitting ? (
                    <Activity className="w-4 h-4 animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4" />
                  )}
                  {isTransmitting ? 'Broadcasting...' : 'Broadcast to Node'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel: Read-Only KPI Scorecard */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-[#0b1222] rounded-[3rem] p-10 shadow-2xl text-white relative overflow-hidden flex flex-col min-h-[600px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full -mr-32 -mt-32"></div>
            
            <div className="flex items-center gap-4 mb-10 relative z-10">
              <div className="w-11 h-11 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/40">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] leading-none mb-1">System Scorecard</h3>
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest italic">Live Calculated 3P Matrix</p>
              </div>
            </div>

            <div className="space-y-10 relative z-10 overflow-y-auto max-h-[700px] pr-4 custom-scrollbar">
              {kpiData.map((category, idx) => (
                <div key={idx} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-px bg-slate-800 flex-grow"></div>
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">{category.category}</span>
                    <div className="h-px bg-slate-800 flex-grow"></div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {category.metrics.map((m, midx) => (
                      <div key={midx} className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl flex items-center justify-between group hover:border-blue-500/30 transition-all">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.name}</p>
                            <div className="relative group/tip">
                              <Info className="w-3 h-3 text-slate-600 cursor-help" />
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-white text-slate-900 text-[8px] font-bold rounded-xl shadow-2xl opacity-0 group-hover/tip:opacity-100 transition-all pointer-events-none z-50 border border-slate-100 uppercase tracking-widest">
                                {m.desc}
                              </div>
                            </div>
                          </div>
                          <p className="text-[9px] font-bold text-slate-600 uppercase">Target: {m.target}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-black text-white tracking-tight">{m.value}</p>
                          <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest border ${getStatusColor(m.status)}`}>
                            {m.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-8 border-t border-slate-800/50 relative z-10">
              <div className="bg-blue-600/10 rounded-2xl p-6 border border-blue-500/20">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-4">Payout Realization</p>
                <div className="flex items-end justify-between">
                  <div className="space-y-1">
                    <p className="text-3xl font-black text-white tracking-tighter">$1,250</p>
                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">ACCUMULATED INCENTIVE</p>
                  </div>
                  <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center animate-pulse">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;