
import React, { useState, useMemo } from 'react';
import { User, UserRole } from '../types';
import { 
  BarChart3, 
  Target, 
  Shield, 
  Users,
  Terminal,
  Cpu,
  RefreshCw,
  Activity,
  Database,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Scale,
  ArrowRight,
  TrendingUp,
  Zap,
  Server,
  Layers,
  Globe,
  Briefcase,
  Search,
  Lock,
  CircleCheck,
  Layout,
  Info
} from 'lucide-react';

interface DashboardProps {
  user: User;
}

interface KPIMetric {
  id: string;
  label: string;
  weight: number;
  target: number;
  unit: string;
  description: string;
}

const ROLE_TEMPLATES: Record<UserRole, { title: string; position: string; metrics: KPIMetric[] }> = {
  [UserRole.EMPLOYEE]: {
    title: "System Performance Console",
    position: "Security Operations Specialist",
    metrics: [
      { id: 'resp', label: 'AVG RESPONSE TIME', weight: 40, target: 300, unit: 'MS', description: 'Emergency node response speed' },
      { id: 'acc', label: 'LOG ACCURACY', weight: 30, target: 98, unit: '%', description: 'Audit trail precision' },
      { id: 'uptime', label: 'NODE UPTIME', weight: 30, target: 99.9, unit: '%', description: 'Continuous hardware operation' },
    ]
  },
  [UserRole.SUPERVISOR]: {
    title: "Unit Oversight Matrix",
    position: "Operations Supervisor",
    metrics: [
      { id: 'prod', label: 'Team Productivity', weight: 50, target: 92, unit: '%', description: 'Aggregated output efficiency' },
      { id: 'error', label: 'Critical Error Rate', weight: 30, target: 0.5, unit: '%', description: 'Node configuration errors' },
      { id: 'train', label: 'Unit Readiness', weight: 20, target: 95, unit: '%', description: 'Personnel certification status' }
    ]
  },
  [UserRole.DEPT_HEAD]: {
    title: "Departmental Strategy Hub",
    position: "Head of Operations",
    metrics: [
      { id: 'budget', label: 'Budget Utilization', weight: 40, target: 96, unit: '%', description: 'Spend vs quarterly projection' },
      { id: 'align', label: 'Strategic Alignment', weight: 30, target: 90, unit: '%', description: 'Progress against objectives' },
      { id: 'risk', label: 'Risk Mitigation', weight: 30, target: 99, unit: '%', description: 'Threat surface reduction' }
    ]
  },
  [UserRole.ADMIN]: {
    title: "Infrastructure Command",
    position: "Systems Administrator",
    metrics: [
      { id: 'uptime', label: 'Global Uptime', weight: 60, target: 99.99, unit: '%', description: 'Network-wide availability' },
      { id: 'threat', label: 'Threat Latency', weight: 20, target: 50, unit: 'ms', description: 'Zero-day detection speed' },
      { id: 'health', label: 'Node Integrity', weight: 20, target: 100, unit: '%', description: 'Distributed network health' }
    ]
  },
  [UserRole.EXECUTIVE]: {
    title: "Strategic Growth Board",
    position: "Chief Executive Officer",
    metrics: [
      { id: 'rev', label: 'Revenue Growth', weight: 50, target: 15, unit: '%', description: 'Year-over-year increase' },
      { id: 'margin', label: 'Net Margin', weight: 30, target: 24, unit: '%', description: 'Post-tax profitability' },
      { id: 'market', label: 'Market Expansion', weight: 20, target: 5, unit: 'Nodes', description: 'Regional sector development' }
    ]
  }
};

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const isEmployee = user.role === UserRole.EMPLOYEE;
  const template = ROLE_TEMPLATES[user.role];
  
  const [actuals, setActuals] = useState<Record<string, number>>({
    resp: 285,
    acc: 97.5,
    uptime: 99.8,
    prod: 91,
    error: 0.42,
    train: 94,
    budget: 95.2,
    align: 88,
    risk: 98.5,
    threat: 48,
    health: 100,
    rev: 14.2,
    margin: 23.5,
    market: 4
  });

  const performanceScore = useMemo(() => {
    let score = 0;
    template.metrics.forEach(m => {
      const inverse = ['resp', 'resol', 'patch', 'budget', 'error', 'threat'];
      const ratio = inverse.includes(m.id) ? m.target / actuals[m.id] : actuals[m.id] / m.target;
      score += Math.min(ratio, 1.2) * m.weight;
    });
    return Math.round(score * 10) / 10;
  }, [actuals, template.metrics]);

  if (isEmployee) {
    return (
      <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded tracking-widest uppercase">SP Certified System</span>
              <span className="bg-slate-900 text-white text-[10px] font-black px-2 py-0.5 rounded tracking-widest uppercase">Level: Employee</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">{template.title}</h1>
            <p className="text-slate-400 text-sm font-bold mt-1">
              Personnel: <span className="text-blue-600">{user.name}</span> • Status: <span className="text-emerald-500">Active Connection</span>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white px-6 py-4 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 min-w-[200px]">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Scale className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Base Salary</p>
                <p className="text-xl font-black text-slate-900 tracking-tight">${user.baseSalary.toLocaleString()}</p>
              </div>
            </div>
            <div className="bg-blue-50/50 px-6 py-4 rounded-3xl shadow-sm border border-blue-100/50 flex items-center gap-4 min-w-[200px]">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none mb-1">Target Incentive</p>
                <p className="text-xl font-black text-blue-700 tracking-tight">${user.incentiveTarget.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Validated Objectives Section */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Validated Objectives</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Verified Performance Levels</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {template.metrics.map(metric => (
                  <div key={metric.id} className="bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{metric.label}</p>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-4xl font-black text-slate-900 tracking-tighter">{actuals[metric.id]}</span>
                      <span className="text-sm font-black text-slate-400 uppercase">{metric.unit}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full transition-all duration-1000" 
                        style={{ width: `${Math.min((actuals[metric.id] / metric.target) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Transmission Matrix Section */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-10">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                    <RefreshCw className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Data Transmission Matrix</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Update Performance Logs</p>
                  </div>
                </div>
                <div className="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Validated System Score: {performanceScore}%</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {template.metrics.map(metric => (
                  <div key={`input-${metric.id}`} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{metric.label}</span>
                      <span className="flex items-center gap-1 px-1.5 py-0.5 bg-blue-50 text-[8px] font-black text-blue-600 rounded uppercase tracking-widest">
                        <div className="w-1 h-1 bg-blue-600 rounded-full animate-pulse"></div> Input
                      </span>
                    </div>
                    <div className="relative group">
                      <input 
                        type="text" 
                        readOnly
                        value={actuals[metric.id]}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-xl font-black text-slate-900 outline-none transition-all group-hover:border-blue-200"
                      />
                      <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase">{metric.unit}</span>
                    </div>
                    <div className="flex items-center justify-between px-2">
                       <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Target: {metric.id === 'resp' ? `<${metric.target}` : `${metric.target}%`}</span>
                       <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Weight: {metric.weight}%</span>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-slate-800 active:scale-[0.99] transition-all group shadow-xl shadow-slate-200">
                Establish Transmission
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Recent Node Updates */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-10">
              <div className="flex items-center gap-3 mb-8">
                <Database className="w-5 h-5 text-blue-600" />
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Recent Node Updates</h2>
              </div>
              <div className="space-y-4">
                {[2401, 2402].map((id, i) => (
                  <div key={id} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl border border-slate-100 hover:border-blue-200 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-slate-100 group-hover:shadow-md transition-all">
                        <CircleCheck className="w-6 h-6 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-900 uppercase tracking-tight">Audit Log #{id}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">2024-05-{18-i} 09:42</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[8px] text-slate-300 font-mono mb-1">0x2...F3c</p>
                       <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Verified</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 space-y-8">
            {/* P3 Realization Card */}
            <div className="bg-[#0f172a] rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px] -mr-24 -mt-24 transition-all group-hover:bg-blue-500/20"></div>
              
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-sm font-black uppercase tracking-widest">P3 Realization</h2>
                  <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Validated Payout</p>
                </div>
              </div>

              <div className="space-y-10">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Validated Multiplier</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black tracking-tighter">1.00</span>
                    <span className="text-xl font-black text-blue-500">x</span>
                  </div>
                </div>

                <div className="pt-10 border-t border-slate-800">
                   <div className="flex justify-between items-end mb-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Projected Yield</p>
                      <p className="text-2xl font-black text-emerald-400 tracking-tight">$11,978.029</p>
                   </div>
                   <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full w-[99.8%]"></div>
                   </div>
                </div>
              </div>
            </div>

            {/* System Security Card */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-10">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">System Security</h2>
              <div className="flex items-center gap-6 p-6 bg-slate-50/50 rounded-3xl border border-slate-100">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900 uppercase tracking-tight mb-1">Supervisor Audit</p>
                  <p className="text-[9px] text-slate-400 font-medium leading-relaxed">
                    Updates only commit after hierarchical verification.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions / Notices */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[2.5rem] p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Info className="w-5 h-5" />
                <h3 className="text-xs font-black uppercase tracking-widest">Protocol Notice</h3>
              </div>
              <p className="text-xs text-blue-100 leading-relaxed font-medium mb-6">
                Terminal synchronization is required every 4 hours for continuous incentive calculation.
              </p>
              <button className="w-full py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                View Manual
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Generic View for other Roles (Supervisor, Dept Head, etc)
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">{template.title}</h1>
          <p className="text-slate-500 text-xs font-bold mt-1 tracking-widest uppercase">
            {template.position} • {user.name}
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
             <p className="text-xl font-black text-blue-600">{performanceScore}%</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {template.metrics.map(metric => (
          <div key={metric.id} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:border-blue-200 transition-all group">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{metric.label}</span>
              <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                <Activity className="w-4 h-4 text-slate-300 group-hover:text-blue-500" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-black text-slate-900 tracking-tighter">{actuals[metric.id]}</span>
              <span className="text-sm font-black text-slate-400">{metric.unit}</span>
            </div>
            <div className="space-y-2">
               <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Target: {metric.target}{metric.unit}</span>
                  <span className="text-[9px] font-black text-blue-600 uppercase">Weight: {metric.weight}%</span>
               </div>
               <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full" 
                    style={{ width: `${Math.min((actuals[metric.id] / metric.target) * 100, 100)}%` }}
                  ></div>
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
           <h2 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
             <Layers className="w-4 h-4 text-blue-600" />
             Hierarchical Activity Log
           </h2>
           <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-100 group cursor-pointer hover:bg-white transition-all">
                  <div className="flex items-center gap-5">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 group-hover:shadow-sm">
                      <Terminal className="w-5 h-5 text-slate-300 group-hover:text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900 uppercase">System Sync: Node_{100 + i}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Validation Token: {Math.random().toString(16).substring(2, 8).toUpperCase()}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-200 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </div>
              ))}
           </div>
        </div>

        <div className="space-y-8">
          <div className="bg-[#0f172a] rounded-[2rem] p-8 text-white relative overflow-hidden">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Strategic Focus</h3>
            <div className="space-y-6">
              <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Quarterly Objective</p>
                <p className="text-xs font-bold leading-relaxed">Ensure decentralized node stability across all regional sectors.</p>
              </div>
              <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                Update Strategy
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Node Connectivity</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">Mainframe A</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">Sync Relay</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">Audit Cache</span>
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
