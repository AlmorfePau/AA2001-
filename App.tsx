
import React, { useState, useCallback, useEffect } from 'react';
import { User, UserRole, Transmission, SystemStats } from './types';
import LoginCard from './components/LoginCard';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Centralized state for the transmission/validation flow with LocalStorage initialization
  const [pendingTransmissions, setPendingTransmissions] = useState<Transmission[]>(() => {
    const saved = localStorage.getItem('aa2001_pending_transmissions');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [validatedStats, setValidatedStats] = useState<Record<string, SystemStats>>(() => {
    const saved = localStorage.getItem('aa2001_validated_stats');
    return saved ? JSON.parse(saved) : {};
  });

  // Persist state changes to LocalStorage
  useEffect(() => {
    localStorage.setItem('aa2001_pending_transmissions', JSON.stringify(pendingTransmissions));
  }, [pendingTransmissions]);

  useEffect(() => {
    localStorage.setItem('aa2001_validated_stats', JSON.stringify(validatedStats));
  }, [validatedStats]);

  const handleLogin = useCallback((loggedInUser: User) => {
    setUser(loggedInUser);
    setIsAuthenticated(true);
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const handleTransmit = useCallback((transmission: Transmission) => {
    setPendingTransmissions(prev => [...prev, transmission]);
  }, []);

  const handleValidate = useCallback((transmissionId: string) => {
    const transmission = pendingTransmissions.find(t => t.id === transmissionId);
    if (transmission) {
      setValidatedStats(prev => ({
        ...prev,
        [transmission.userId]: {
          responseTime: transmission.responseTime,
          accuracy: transmission.accuracy,
          uptime: transmission.uptime
        }
      }));
      setPendingTransmissions(prev => prev.filter(t => t.id !== transmissionId));
    }
  }, [pendingTransmissions]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {isAuthenticated && user ? (
        <>
          <Navbar user={user} onLogout={handleLogout} />
          <main className="flex-grow p-4 md:p-8 animate-in fade-in duration-500">
            <Dashboard 
              user={user} 
              pendingTransmissions={pendingTransmissions}
              validatedStats={validatedStats}
              onTransmit={handleTransmit}
              onValidate={handleValidate}
            />
          </main>
        </>
      ) : (
        <div className="flex-grow flex flex-col items-center justify-center p-4 py-12 bg-gradient-to-br from-slate-50 to-blue-50">
          <LoginCard onLogin={handleLogin} />
        </div>
      )}
      
      <footer className="py-6 text-center text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} AA2001 Security and Technology Solutions Inc. All Rights Reserved.
      </footer>
    </div>
  );
};

export default App;
