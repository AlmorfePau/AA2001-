
import React from 'react';
import { User, UserRole } from '../types';
import { LogOut, Bell, Search, Settings } from 'lucide-react';
import Logo from './Logo';

interface NavbarProps {
  user: User;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-12">
            <div className="flex items-center">
              <Logo size="sm" className="!flex-row !gap-3" />
            </div>
            {/* Conditional navigation for non-employee roles */}
            {user.role !== UserRole.EMPLOYEE && (
              <div className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-slate-400">
                <a href="#" className="text-blue-600 relative after:content-[''] after:absolute after:bottom-[-29px] after:left-0 after:w-full after:h-1 after:bg-blue-600 after:rounded-t-full">Console</a>
                <a href="#" className="hover:text-slate-900 transition-colors">Resources</a>
                <a href="#" className="hover:text-slate-900 transition-colors">Nodes</a>
                <a href="#" className="hover:text-slate-900 transition-colors">Audit</a>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Conditional search bar for non-employee roles */}
            {user.role !== UserRole.EMPLOYEE && (
              <div className="hidden lg:flex items-center relative group">
                <Search className="absolute left-4 w-4 h-4 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Query system..."
                  className="pl-11 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold uppercase tracking-wider focus:outline-none focus:ring-4 focus:ring-blue-500/10 w-48 transition-all focus:bg-white focus:w-64"
                />
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <button className="p-2.5 text-slate-400 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-all relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></span>
              </button>
              <button className="p-2.5 text-slate-400 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-all">
                <Settings className="w-5 h-5" />
              </button>
            </div>

            <div className="h-8 w-px bg-slate-100 mx-2 hidden sm:block"></div>

            <div className="flex items-center gap-3 pl-2 group relative">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-slate-900 leading-tight">{user.name}</p>
                <p className="text-[9px] text-blue-600 font-black uppercase tracking-[0.2em]">{user.role}</p>
              </div>
              
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 text-white flex items-center justify-center rounded-xl font-bold shadow-lg shadow-blue-500/20 cursor-pointer border-2 border-transparent group-hover:border-blue-100 transition-all">
                {user.name.charAt(0).toUpperCase()}
              </div>

              {/* Profile Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 translate-y-2 group-hover:translate-y-0 z-50">
                <div className="px-5 py-3 border-b border-slate-50 mb-1 sm:hidden">
                  <p className="text-xs font-black text-slate-900">{user.name}</p>
                  <p className="text-[9px] text-blue-600 font-black uppercase tracking-widest">{user.role}</p>
                </div>
                <button className="w-full text-left px-5 py-2.5 text-xs font-bold text-slate-500 uppercase tracking-widest hover:bg-slate-50 hover:text-blue-600 transition-colors">Profile Settings</button>
                <button className="w-full text-left px-5 py-2.5 text-xs font-bold text-slate-500 uppercase tracking-widest hover:bg-slate-50 hover:text-blue-600 transition-colors">Security Keys</button>
                <div className="h-px bg-slate-50 my-1.5 mx-3"></div>
                <button 
                  onClick={onLogout}
                  className="w-full text-left px-5 py-2.5 text-xs font-black text-red-500 uppercase tracking-widest hover:bg-red-50 transition-colors flex items-center gap-3"
                >
                  <LogOut className="w-4 h-4" />
                  Terminate Session
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
