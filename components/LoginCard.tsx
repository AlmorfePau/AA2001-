import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { LogIn, Shield, User as UserIcon, Lock, ChevronDown, Activity, Cpu } from 'lucide-react';
import Logo from './Logo';

interface LoginCardProps {
  onLogin: (user: User) => void;
}

const ROLE_FINANCIALS: Record<UserRole, { base: number; target: number }> = {
  [UserRole.EMPLOYEE]: { base: 62000, target: 12000 },
  [UserRole.SUPERVISOR]: { base: 88000, target: 18000 },
  [UserRole.DEPT_HEAD]: { base: 135000, target: 45000 },
  [UserRole.ADMIN]: { base: 105000, target: 25000 },
  [UserRole.EXECUTIVE]: { base: 275000, target: 125000 },
};

// Hierarchical sorting: Highest to Lowest
const SORTED_ROLES = [
  UserRole.EXECUTIVE,
  UserRole.ADMIN,
  UserRole.DEPT_HEAD,
  UserRole.SUPERVISOR,
  UserRole.EMPLOYEE,
];

const LoginCard: React.FC<LoginCardProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.EXECUTIVE);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate secure authentication
    setTimeout(() => {
      const financial = ROLE_FINANCIALS[selectedRole];
      onLogin({
        id: Math.random().toString(36).substr(2, 9),
        name: name || `User_${selectedRole}`,
        email: `${(name || selectedRole).toLowerCase().replace(/\s/g, '')}@aa2001.com`,
        role: selectedRole,
        baseSalary: financial.base,
        incentiveTarget: financial.target
      });
    }, 1200);
  };

  return (
    <div className="w-full max-w-md animate-in fade-in zoom-in duration-700">
      <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-slate-100 relative overflow-hidden">
        {/* Aesthetic Accents */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-600/5 rounded-full blur-2xl -ml-12 -mb-12"></div>

        <div className="relative z-10 flex flex-col items-center">
          <Logo size="md" className="mb-6" />
          
          {/* Professional KPI Console Header */}
          <div className="text-center mb-10 w-full">
            <div className="flex items-center justify-center gap-2 mb-1">
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
                KPI<span className="text-blue-600">.</span>CONSOLE
              </h2>
              <span className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 border border-blue-100 rounded-md">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></div>
                <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest">CORE V4.2</span>
              </span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="h-px bg-slate-100 flex-grow"></div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] whitespace-nowrap">
                Strategic Performance Intelligence
              </p>
              <div className="h-px bg-slate-100 flex-grow"></div>
            </div>
            <p className="text-[8px] font-bold text-slate-300 uppercase tracking-[0.1em] mt-2 italic">
              Key Performance Indicator Framework
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-5">
            {/* Identity Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Personnel Identity</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input 
                  type="text" 
                  required
                  placeholder="Employee Name"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all font-bold text-sm text-slate-900 placeholder:text-slate-300"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            {/* Position Selector - Sorted Highest to Lowest */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Level</label>
              <div className="relative">
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <select 
                  className="w-full pl-12 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none appearance-none transition-all font-bold text-sm text-slate-900 cursor-pointer"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                >
                  {SORTED_ROLES.map((role) => (
                    <option key={role} value={role} className="text-slate-900">{role}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Credential Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Passkey</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all font-bold text-sm text-slate-900 placeholder:text-slate-300"
                  defaultValue="123456"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full mt-2 bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-2xl shadow-xl shadow-slate-900/10 transition-all active:scale-[0.98] flex items-center justify-center gap-3 uppercase text-[11px] tracking-[0.2em] group"
            >
              {isLoading ? (
                <Activity className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Establish Connection
                  <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
      
      <div className="mt-8 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
           <Cpu className="w-3.5 h-3.5 text-slate-300" />
           <p className="text-slate-400 text-[9px] font-bold uppercase tracking-[0.3em]">
             AA2001 Distributed Intelligence Network
           </p>
        </div>
        <div className="px-4 py-1 bg-slate-100/50 rounded-full border border-slate-200/50">
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Authorized Access Only</p>
        </div>
      </div>
    </div>
  );
};

export default LoginCard;